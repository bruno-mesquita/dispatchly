import { env } from "@dispatchly/env/server";
import { Expo } from "expo-server-sdk";
import type {
	NotificationProvider,
	ProviderResponse,
	SendNotificationInput,
} from "../types/index.js";

export class ExpoProvider implements NotificationProvider {
	readonly name = "expo";
	private client: Expo;

	constructor() {
		this.client = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });
	}

	async send(input: SendNotificationInput): Promise<ProviderResponse> {
		try {
			const chunks = this.client.chunkPushNotifications([
				{ to: [input.to], sound: "default", body: input.content },
			]);

			const tickets = [];
			for (const chunk of chunks) {
				const response = await this.client.sendPushNotificationsAsync(chunk);
				tickets.push(...response);
			}

			const ticket = tickets[0];
			if (ticket?.status === "ok") {
				return {
					messageId: ticket.id,
					status: "sent",
					provider: this.name,
				};
			}

			return {
				messageId: "",
				status: "failed",
				provider: this.name,
				error: ticket?.message || "Unknown error",
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

export const expoProvider = new ExpoProvider();
