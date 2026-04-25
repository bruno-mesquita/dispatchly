export type Channel = "email" | "sms" | "push";

export interface DispatchlyConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface SendOptions {
	to: string;
	template: string;
	channels: Channel[];
	data: Record<string, unknown>;
}

export interface SendResult {
	id: string;
	status: "queued" | "sent" | "delivered" | "failed";
}

export interface Template {
	id: string;
	name: string;
	type: Channel;
	subject?: string;
	content: string;
	variables: string[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTemplateOptions {
	name: string;
	type: Channel;
	subject?: string;
	content: string;
	variables?: string[];
}

export interface UpdateTemplateOptions {
	name?: string;
	type?: Channel;
	subject?: string;
	content?: string;
	variables?: string[];
	isActive?: boolean;
}

export interface Webhook {
	id: string;
	url: string;
	events: string[];
	isActive: boolean;
	createdAt: string;
}

export interface CreateWebhookOptions {
	url: string;
	events: string[];
}

export interface ListOptions {
	limit?: number;
	offset?: number;
}
