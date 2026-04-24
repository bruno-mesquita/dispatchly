export interface DispatchlyConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface SendOptions {
	to: string;
	template: string;
	channels: ("email" | "sms" | "push")[];
	data: Record<string, unknown>;
}

export interface SendResult {
	id: string;
	status: string;
}

export class Dispatchly {
	private apiKey: string;
	private baseUrl: string;

	constructor(config: DispatchlyConfig) {
		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl || "https://api.dispatchly.com";
	}

	async send(options: SendOptions): Promise<SendResult> {
		const response = await fetch(`${this.baseUrl}/v1/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify(options),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to send notification");
		}

		return response.json();
	}
}
