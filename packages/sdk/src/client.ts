import { DispatchlyError } from "./errors";
import type { DispatchlyConfig } from "./types";

export class HttpClient {
	private apiKey: string;
	private baseUrl: string;

	constructor(config: DispatchlyConfig) {
		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl || "https://api.dispatchly.com";
	}

	async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new DispatchlyError(
				errorData.error || response.statusText,
				response.status,
				errorData.code,
			);
		}

		return response.json() as Promise<T>;
	}

	get<T>(path: string, options?: RequestInit): Promise<T> {
		return this.request<T>(path, { ...options, method: "GET" });
	}

	post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
		return this.request<T>(path, {
			...options,
			method: "PATCH",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	delete<T>(path: string, options?: RequestInit): Promise<T> {
		return this.request<T>(path, { ...options, method: "DELETE" });
	}
}
