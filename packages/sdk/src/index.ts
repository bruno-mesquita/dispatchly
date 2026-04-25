import { HttpClient } from "./client";
import { Notifications } from "./resources/notifications";
import { Templates } from "./resources/templates";
import { Webhooks } from "./resources/webhooks";
import type { DispatchlyConfig, SendOptions, SendResult } from "./types";

export * from "./errors";
export * from "./types";

export class Dispatchly {
	private client: HttpClient;
	public notifications: Notifications;
	public templates: Templates;
	public webhooks: Webhooks;

	constructor(config: DispatchlyConfig) {
		this.client = new HttpClient(config);
		this.notifications = new Notifications(this.client);
		this.templates = new Templates(this.client);
		this.webhooks = new Webhooks(this.client);
	}

	/**
	 * Shortcut to notifications.send
	 */
	async send(options: SendOptions): Promise<SendResult> {
		return this.notifications.send(options);
	}

	/**
	 * Shortcut to notifications.batch
	 */
	async batch(options: SendOptions[]): Promise<SendResult[]> {
		return this.notifications.batch(options);
	}
}
