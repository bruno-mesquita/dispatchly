"use client";

import type { NotificationLog } from "./use-notification-logs";

const RECENT_LOGS: NotificationLog[] = [
	{
		id: "log_1",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "alice@example.com",
		subject: "Bem-vindo!",
		sentAt: "2024-04-23T10:05:00Z",
		createdAt: "2024-04-23T10:04:00Z",
	},
	{
		id: "log_2",
		type: "sms",
		status: "sent",
		provider: "twilio",
		to: "+5511999990001",
		createdAt: "2024-04-23T09:55:00Z",
	},
	{
		id: "log_3",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[abc123]",
		createdAt: "2024-04-23T09:50:00Z",
	},
	{
		id: "log_4",
		type: "email",
		status: "failed",
		provider: "resend",
		to: "invalido@dominio.xyz",
		subject: "Lembrete",
		createdAt: "2024-04-23T09:40:00Z",
	},
	{
		id: "log_5",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "bob@empresa.com",
		subject: "Fatura #1042",
		sentAt: "2024-04-23T09:30:00Z",
		createdAt: "2024-04-23T09:29:00Z",
	},
];

// TODO: replace with trpc.notifications.stats.useQuery() + trpc.notifications.list.useQuery({ limit: 5 })
export function useDashboardOverview() {
	const stats = {
		totalSent: 1615,
		delivered: 1430,
		failed: 45,
		deliveryRate: 88,
	};

	const byType = {
		email: 970,
		sms: 405,
		push: 240,
	};

	return {
		stats,
		byType,
		recentLogs: RECENT_LOGS,
		isLoading: false as const,
		error: null,
	};
}
