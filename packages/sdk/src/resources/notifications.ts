import type { HttpClient } from "../client";
import type { ListOptions, SendOptions, SendResult } from "../types";

export class Notifications {
	constructor(private client: HttpClient) {}

	async send(options: SendOptions): Promise<SendResult> {
		return this.client.post<SendResult>("/v1/send", options);
	}

	async batch(options: SendOptions[]): Promise<SendResult[]> {
		return this.client.post<SendResult[]>("/v1/batch", {
			notifications: options,
		});
	}

	async list(options?: ListOptions): Promise<SendResult[]> {
		const params = new URLSearchParams();
		if (options?.limit) params.append("limit", options.limit.toString());
		if (options?.offset) params.append("offset", options.offset.toString());

		const query = params.toString();
		return this.client.get<SendResult[]>(
			`/v1/notifications${query ? `?${query}` : ""}`,
		);
	}

	async cancel(id: string): Promise<{ success: boolean }> {
		return this.client.post<{ success: boolean }>(
			`/v1/notifications/${id}/cancel`,
		);
	}
}
