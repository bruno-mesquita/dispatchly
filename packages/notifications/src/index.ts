export { resendProvider, ResendProvider } from "./providers/resend.js";
export { twilioProvider, TwilioProvider } from "./providers/twilio.js";
export { expoProvider, ExpoProvider } from "./providers/expo.js";

export type {
	NotificationType,
	NotificationStatus,
	SendNotificationInput,
	ProviderResponse,
	NotificationProvider,
} from "./types/index.js";

import type { NotificationProvider } from "./types/index.js";
import { resendProvider } from "./providers/resend.js";
import { twilioProvider } from "./providers/twilio.js";
import { expoProvider } from "./providers/expo.js";

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
	type JobData,
	emailQueue,
	smsQueue,
	pushQueue,
	retryQueue,
	addToQueue,
	addRetryJob,
} from "./queue/worker.js";
export { worker } from "./queue/worker.js";
