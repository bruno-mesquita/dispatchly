"use client";

import { useState } from "react";

export type WebhookEvent =
	| "notification.sent"
	| "notification.delivered"
	| "notification.failed"
	| "notification.bounced";

export type Webhook = {
	id: string;
	name: string;
	url: string;
	secret: string;
	events: WebhookEvent[];
	isActive: boolean;
	lastTriggeredAt?: string;
	createdAt: string;
};

const INITIAL_WEBHOOKS: Webhook[] = [
	{
		id: "wh_1",
		name: "Status de Entrega",
		url: "https://minha-empresa.com/webhooks/entrega",
		secret: "whsec_aaa111",
		events: ["notification.delivered", "notification.failed"],
		isActive: true,
		lastTriggeredAt: "2024-04-23T10:05:00Z",
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: "wh_2",
		name: "Todos os Eventos",
		url: "https://minha-empresa.com/webhooks/todos",
		secret: "whsec_bbb222",
		events: [
			"notification.sent",
			"notification.delivered",
			"notification.failed",
			"notification.bounced",
		],
		isActive: false,
		lastTriggeredAt: "2024-04-20T12:00:00Z",
		createdAt: "2024-02-01T10:00:00Z",
	},
];

let nextId = 3;

// TODO: replace with trpc calls for webhook CRUD
export function useWebhooks() {
	const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);

	function create(data: Omit<Webhook, "id" | "createdAt" | "lastTriggeredAt">) {
		const wh: Webhook = {
			...data,
			id: `wh_${nextId++}`,
			createdAt: new Date().toISOString(),
		};
		setWebhooks((prev) => [wh, ...prev]);
		return wh;
	}

	function toggle(id: string) {
		setWebhooks((prev) =>
			prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)),
		);
	}

	function remove(id: string) {
		setWebhooks((prev) => prev.filter((w) => w.id !== id));
	}

	return {
		webhooks,
		create,
		toggle,
		remove,
		isLoading: false as const,
		error: null,
	};
}
