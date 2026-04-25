import { checkQuota, incrementUsage } from "@dispatchly/billing";
import { NotificationLog } from "@dispatchly/db";
import { addToQueue, type JobData } from "@dispatchly/notifications";
import { applyTemplate } from "@dispatchly/templates";

export interface SendNotificationInput {
	type: "email" | "sms" | "push";
	to: string;
	subject?: string;
	content?: string;
	templateId?: string;
	variables?: Record<string, unknown>;
}

export async function sendNotification(
	input: SendNotificationInput,
	orgId: string,
) {
	const channel =
		input.type === "email" ? "emails" : input.type === "sms" ? "sms" : "push";
	const quota = await checkQuota(orgId, channel);

	if (!quota.allowed) {
		throw new Error("Quota exceeded");
	}

	let content = input.content || "";
	let subject = input.subject || "";

	if (input.templateId) {
		const rendered = await applyTemplate(
			input.templateId,
			input.variables || {},
		);
		content = rendered.content;
		subject = rendered.subject || "";
	}

	const log = new NotificationLog({
		orgId,
		type: input.type,
		provider:
			input.type === "email"
				? "resend"
				: input.type === "sms"
					? "twilio"
					: "expo",
		to: input.to,
		templateId: input.templateId,
		subject,
		content,
		status: "pending",
	});
	await log.save();

	const jobData: JobData = {
		organizationId: orgId,
		notificationLogId: log._id.toString(),
		type: input.type,
		to: input.to,
		subject,
		content,
	};

	await addToQueue(input.type, jobData);
	await incrementUsage(orgId, channel);

	return { id: log._id, status: "pending" };
}
