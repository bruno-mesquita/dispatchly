import { env } from "@dispatchly/env/server";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { getProvider } from "../index.js";
import type { SendNotificationInput } from "../types/index.js";

const connection = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("notifications:email", { connection });
export const smsQueue = new Queue("notifications:sms", { connection });
export const pushQueue = new Queue("notifications:push", { connection });
export const retryQueue = new Queue("notifications:retry", { connection });

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

const worker = new Worker(
	"notifications:email",
	async (job) => {
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

		if (result.status === "failed" && job.attemptsMade < 2) {
			await addRetryJob(data);
		}

		return result;
	},
	{ connection },
);

worker.on("completed", (job) => {
	console.log(`Notification ${job.id} completed`);
});

worker.on("failed", (job, err) => {
	console.error(`Notification ${job.id} failed:`, err.message);
});

export { worker };
