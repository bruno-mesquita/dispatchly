import type { HttpClient } from "../client";
import type { CreateWebhookOptions, ListOptions, Webhook } from "../types";

export class Webhooks {
	constructor(private client: HttpClient) {}

	async list(options?: ListOptions): Promise<Webhook[]> {
		const params = new URLSearchParams();
		if (options?.limit) params.append("limit", options.limit.toString());
		if (options?.offset) params.append("offset", options.offset.toString());

		const query = params.toString();
		return this.client.get<Webhook[]>(
			`/v1/webhooks${query ? `?${query}` : ""}`,
		);
	}

	async create(data: CreateWebhookOptions): Promise<Webhook> {
		return this.client.post<Webhook>("/v1/webhooks", data);
	}

	async delete(id: string): Promise<{ success: boolean }> {
		return this.client.delete<{ success: boolean }>(`/v1/webhooks/${id}`);
	}
}
