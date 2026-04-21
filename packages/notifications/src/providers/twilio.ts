import { env } from "@dispatchly/env/server";
import Twilio from "twilio";
import type {
	NotificationProvider,
	ProviderResponse,
	SendNotificationInput,
} from "../types/index.js";

export class TwilioProvider implements NotificationProvider {
	readonly name = "twilio";
	private client: Twilio;

	constructor() {
		// @ts-expect-error - Twilio SDK type mismatch
		this.client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
	}

	async send(input: SendNotificationInput): Promise<ProviderResponse> {
		if (!env.TWILIO_PHONE_NUMBER) {
			return {
				messageId: "",
				status: "failed",
				provider: this.name,
				error: "TWILIO_PHONE_NUMBER not configured",
			};
		}

		try {
			const message = await this.client.messages.create({
				body: input.content,
				from: env.TWILIO_PHONE_NUMBER,
				to: input.to,
			});

			return {
				messageId: message.sid,
				status: message.status === "delivered" ? "delivered" : "sent",
				provider: this.name,
			};
		} catch (error) {
			return {
				messageId: "",
				status: "failed",
				provider: this.name,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

export const twilioProvider = new TwilioProvider();
