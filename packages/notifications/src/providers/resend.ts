import { Resend } from "resend";
import { env } from "@dispatchly/env/server";
import type {
	SendNotificationInput,
	ProviderResponse,
	NotificationProvider,
} from "../types/index.js";

export class ResendProvider implements NotificationProvider {
	readonly name = "resend";
	private client: Resend;

	constructor() {
		this.client = new Resend(env.RESEND_API_KEY);
	}

	async send(input: SendNotificationInput): Promise<ProviderResponse> {
		try {
			const { data, error } = await this.client.emails.send({
				from: env.RESEND_FROM_EMAIL || " Dispatchly <noreply@dispatchly.dev>",
				to: input.to,
				subject: input.subject || "",
				html: input.content,
			});

			if (error) {
				return {
					messageId: "",
					status: "failed",
					provider: this.name,
					error: error.message,
				};
			}

			return {
				messageId: data?.id || "",
				status: "sent",
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

export const resendProvider = new ResendProvider();
