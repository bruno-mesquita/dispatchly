import crypto from "node:crypto";
import { NotificationLog, Organization } from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { type Job, Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { getProvider } from "../index.js";
import type { SendNotificationInput } from "../types/index.js";

const connection = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("notifications-email", { connection });
export const smsQueue = new Queue("notifications-sms", { connection });
export const pushQueue = new Queue("notifications-push", { connection });
export const retryQueue = new Queue("notifications-retry", { connection });
export const webhooksQueue = new Queue("webhooks", {
	connection,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 60000,
		},
	},
});

export interface JobData extends SendNotificationInput {
	organizationId: string;
	notificationLogId: string;
}

export async function addToQueue(
	type: "email" | "sms" | "push",
	data: JobData,
	options?: { priority?: number; delay?: number },
): Promise<void> {
	const queue =
		type === "email" ? emailQueue : type === "sms" ? smsQueue : pushQueue;

	await queue.add("send", data, {
		priority: options?.priority ?? 1,
		delay: options?.delay ?? 0,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 60000,
		},
	});
}

export async function addRetryJob(data: JobData): Promise<void> {
	await retryQueue.add("retry", data, {
		delay: 60000,
	});
}

async function notificationProcessor(job: Job) {
	if (!job.data) return;
	const data = job.data as JobData;
	const provider = getProvider(data.type);
	const result = await provider.send({
		type: data.type,
		to: data.to,
		subject: data.subject,
		content: data.content,
		templateId: data.templateId,
		variables: data.variables,
	});

	// Update NotificationLog status in the database
	await NotificationLog.findByIdAndUpdate(data.notificationLogId, {
		status: result.status,
		messageId: result.messageId,
		provider: result.provider,
		error: result.error,
		sentAt: result.status === "sent" ? new Date() : undefined,
	});

	// If the status is terminal, check if organization has a webhook configured
	const terminalStatuses = ["sent", "delivered", "failed", "bounced"];
	if (terminalStatuses.includes(result.status)) {
		const org = await Organization.findById(data.organizationId);
		if (org?.settings?.webhookUrl) {
			await webhooksQueue.add("webhook", {
				orgId: data.organizationId,
				event: `notification.${result.status}`,
				payload: {
					notificationId: data.notificationLogId,
					type: data.type,
					status: result.status,
					to: data.to,
					messageId: result.messageId,
					error: result.error,
				},
			});
		}
	}

	if (result.status === "failed" && job.attemptsMade < 2) {
		await addRetryJob(data);
	}

	return result;
}

export const emailWorker = new Worker(
	"notifications-email",
	notificationProcessor,
	{
		connection,
	},
);

export const smsWorker = new Worker(
	"notifications-sms",
	notificationProcessor,
	{
		connection,
	},
);

export const pushWorker = new Worker(
	"notifications-push",
	notificationProcessor,
	{
		connection,
	},
);

export const webhooksWorker = new Worker(
	"webhooks",
	async (job) => {
		const { orgId, event, payload } = job.data;
		const org = await Organization.findById(orgId);

		if (!org?.settings?.webhookUrl || !org?.settings?.webhookSecret) {
			return;
		}

		const body = JSON.stringify({
			event,
			payload,
			timestamp: new Date().toISOString(),
		});

		const signature = crypto
			.createHmac("sha256", org.settings.webhookSecret)
			.update(body)
			.digest("hex");

		const response = await fetch(org.settings.webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Dispatchly-Signature": `sha256=${signature}`,
			},
			body,
		});

		if (!response.ok) {
			throw new Error(`Webhook delivery failed with status ${response.status}`);
		}
	},
	{ connection },
);

// Export worker for backward compatibility (defaulting to emailWorker)
export const worker = emailWorker;

// Listen for common events
[emailWorker, smsWorker, pushWorker, webhooksWorker].forEach((w) => {
	w.on("completed", (job) => {
		console.log(`${w.name} job ${job.id} completed`);
	});

	w.on("failed", (job, err) => {
		console.error(`${w.name} job ${job?.id} failed:`, err.message);
	});
});
