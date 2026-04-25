"use client";

import { useState } from "react";

export type Webhook = {
	id: string;
	orgId: string;
	orgName: string;
	name: string;
	url: string;
	events: string[];
	isActive: boolean;
	lastTriggeredAt?: string;
	createdAt: string;
};

const PAGE_SIZE = 20;

const MOCK: Webhook[] = [
	{
		id: "wh_1",
		orgId: "org_1",
		orgName: "Acme Corp",
		name: "Delivery Status",
		url: "https://acmecorp.com/webhooks/notify",
		events: ["notification.delivered", "notification.failed"],
		isActive: true,
		lastTriggeredAt: "2024-04-23T10:05:00Z",
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: "wh_2",
		orgId: "org_3",
		orgName: "Global Retail",
		name: "Order Notifications",
		url: "https://api.globalretail.com/hooks/dispatchly",
		events: ["notification.delivered", "notification.bounced"],
		isActive: true,
		lastTriggeredAt: "2024-04-23T09:55:00Z",
		createdAt: "2023-11-09T10:00:00Z",
	},
	{
		id: "wh_3",
		orgId: "org_5",
		orgName: "HealthTech",
		name: "All Events",
		url: "https://hooks.healthtech.com/dispatchly",
		events: [
			"notification.sent",
			"notification.delivered",
			"notification.failed",
			"notification.bounced",
		],
		isActive: true,
		lastTriggeredAt: "2024-04-23T08:40:00Z",
		createdAt: "2024-02-02T10:00:00Z",
	},
	{
		id: "wh_4",
		orgId: "org_7",
		orgName: "FinanceApp",
		name: "Critical Alerts",
		url: "https://finance.io/webhooks/notifications",
		events: ["notification.failed", "notification.bounced"],
		isActive: true,
		lastTriggeredAt: "2024-04-23T08:00:00Z",
		createdAt: "2023-09-13T10:00:00Z",
	},
	{
		id: "wh_5",
		orgId: "org_9",
		orgName: "MediaGroup",
		name: "Delivery Hook",
		url: "https://mediagroup.io/api/hooks",
		events: ["notification.delivered"],
		isActive: false,
		lastTriggeredAt: "2024-04-20T12:00:00Z",
		createdAt: "2024-01-07T10:00:00Z",
	},
	{
		id: "wh_6",
		orgId: "org_2",
		orgName: "TechStartup Inc",
		name: "Dev Webhook",
		url: "https://webhook.site/test-abc123",
		events: [
			"notification.sent",
			"notification.delivered",
			"notification.failed",
		],
		isActive: true,
		createdAt: "2024-02-21T10:00:00Z",
	},
];

export function useWebhooks(defaultOrgId?: string) {
	const [page, setPage] = useState(1);
	const [orgId] = useState<string | undefined>(defaultOrgId);

	// TODO: replace with trpc.admin.webhooks.list.useQuery({ page, limit: PAGE_SIZE, orgId })
	const filtered = MOCK.filter((w) => !orgId || w.orgId === orgId);
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		webhooks: items,
		total: filtered.length,
		page,
		setPage,
		isLoading: false as const,
		error: null,
	};
}
