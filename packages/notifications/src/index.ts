export { ExpoProvider, expoProvider } from "./providers/expo.js";
export { ResendProvider, resendProvider } from "./providers/resend.js";
export { TwilioProvider, twilioProvider } from "./providers/twilio.js";

export type {
	NotificationProvider,
	NotificationStatus,
	NotificationType,
	ProviderResponse,
	SendNotificationInput,
} from "./types/index.js";

import { expoProvider } from "./providers/expo.js";
import { resendProvider } from "./providers/resend.js";
import { twilioProvider } from "./providers/twilio.js";
import type { NotificationProvider } from "./types/index.js";

export function getProvider(
	type: "email" | "sms" | "push",
): NotificationProvider {
	switch (type) {
		case "email":
			return resendProvider;
		case "sms":
			return twilioProvider;
		case "push":
			return expoProvider;
		default:
			return resendProvider;
	}
}

export {
	addRetryJob,
	addToQueue,
	emailQueue,
	emailWorker,
	type JobData,
	pushQueue,
	pushWorker,
	retryQueue,
	smsQueue,
	smsWorker,
	webhooksQueue,
	webhooksWorker,
	worker,
} from "./queue/worker.js";
