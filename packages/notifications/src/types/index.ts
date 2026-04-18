export type NotificationType = "email" | "sms" | "push";

export type NotificationStatus =
	| "pending"
	| "sent"
	| "delivered"
	| "failed"
	| "bounced";

export interface SendNotificationInput {
	type: NotificationType;
	to: string;
	subject?: string;
	content: string;
	templateId?: string;
	variables?: Record<string, unknown>;
}

export interface ProviderResponse {
	messageId: string;
	status: NotificationStatus;
	provider: string;
	error?: string;
}

export interface NotificationProvider {
	readonly name: string;
	send(input: SendNotificationInput): Promise<ProviderResponse>;
}
