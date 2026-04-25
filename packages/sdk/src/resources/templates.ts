import type { HttpClient } from "../client";
import type {
	CreateTemplateOptions,
	ListOptions,
	Template,
	UpdateTemplateOptions,
} from "../types";

export class Templates {
	constructor(private client: HttpClient) {}

	async list(options?: ListOptions): Promise<Template[]> {
		const params = new URLSearchParams();
		if (options?.limit) params.append("limit", options.limit.toString());
		if (options?.offset) params.append("offset", options.offset.toString());

		const query = params.toString();
		return this.client.get<Template[]>(
			`/v1/templates${query ? `?${query}` : ""}`,
		);
	}

	async get(id: string): Promise<Template> {
		return this.client.get<Template>(`/v1/templates/${id}`);
	}

	async create(data: CreateTemplateOptions): Promise<Template> {
		return this.client.post<Template>("/v1/templates", data);
	}

	async update(id: string, data: UpdateTemplateOptions): Promise<Template> {
		return this.client.patch<Template>(`/v1/templates/${id}`, data);
	}

	async delete(id: string): Promise<{ success: boolean }> {
		return this.client.delete<{ success: boolean }>(`/v1/templates/${id}`);
	}
}
