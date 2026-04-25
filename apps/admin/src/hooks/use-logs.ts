"use client";

import { useState } from "react";

export type LogType = "email" | "sms" | "push";
export type LogStatus = "pending" | "sent" | "delivered" | "failed" | "bounced";

export type NotificationLog = {
	id: string;
	orgId: string;
	orgName: string;
	type: LogType;
	status: LogStatus;
	provider: string;
	to: string;
	subject?: string;
	templateId?: string;
	sentAt?: string;
	createdAt: string;
};

export type LogFilters = {
	type?: LogType;
	status?: LogStatus;
	orgId?: string;
	search?: string;
};

const PAGE_SIZE = 20;

const MOCK: NotificationLog[] = [
	{
		id: "log_1",
		orgId: "org_1",
		orgName: "Acme Corp",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "alice@example.com",
		subject: "Welcome to Acme",
		sentAt: "2024-04-23T10:05:00Z",
		createdAt: "2024-04-23T10:04:00Z",
	},
	{
		id: "log_2",
		orgId: "org_3",
		orgName: "Global Retail",
		type: "sms",
		status: "sent",
		provider: "twilio",
		to: "+15551234567",
		createdAt: "2024-04-23T09:55:00Z",
	},
	{
		id: "log_3",
		orgId: "org_1",
		orgName: "Acme Corp",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[abc123]",
		createdAt: "2024-04-23T09:50:00Z",
	},
	{
		id: "log_4",
		orgId: "org_5",
		orgName: "HealthTech",
		type: "email",
		status: "failed",
		provider: "resend",
		to: "bob@healthtech.com",
		subject: "Appointment Reminder",
		createdAt: "2024-04-23T09:40:00Z",
	},
	{
		id: "log_5",
		orgId: "org_7",
		orgName: "FinanceApp",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "charlie@finance.io",
		subject: "Transaction Alert",
		sentAt: "2024-04-23T09:30:00Z",
		createdAt: "2024-04-23T09:29:00Z",
	},
	{
		id: "log_6",
		orgId: "org_7",
		orgName: "FinanceApp",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+15559876543",
		sentAt: "2024-04-23T09:20:00Z",
		createdAt: "2024-04-23T09:19:00Z",
	},
	{
		id: "log_7",
		orgId: "org_2",
		orgName: "TechStartup Inc",
		type: "email",
		status: "pending",
		provider: "resend",
		to: "dave@techstartup.io",
		subject: "Verify your email",
		createdAt: "2024-04-23T09:10:00Z",
	},
	{
		id: "log_8",
		orgId: "org_9",
		orgName: "MediaGroup",
		type: "push",
		status: "bounced",
		provider: "expo",
		to: "ExponentPushToken[def456]",
		createdAt: "2024-04-23T09:00:00Z",
	},
	{
		id: "log_9",
		orgId: "org_3",
		orgName: "Global Retail",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "eve@globalretail.com",
		subject: "Order Shipped",
		sentAt: "2024-04-23T08:50:00Z",
		createdAt: "2024-04-23T08:49:00Z",
	},
	{
		id: "log_10",
		orgId: "org_5",
		orgName: "HealthTech",
		type: "sms",
		status: "sent",
		provider: "twilio",
		to: "+15553334444",
		createdAt: "2024-04-23T08:40:00Z",
	},
	{
		id: "log_11",
		orgId: "org_1",
		orgName: "Acme Corp",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "frank@acmecorp.com",
		subject: "Invoice #1042",
		sentAt: "2024-04-23T08:30:00Z",
		createdAt: "2024-04-23T08:29:00Z",
	},
	{
		id: "log_12",
		orgId: "org_6",
		orgName: "EduPlatform",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "grace@edu.io",
		subject: "Course Update",
		sentAt: "2024-04-23T08:20:00Z",
		createdAt: "2024-04-23T08:19:00Z",
	},
	{
		id: "log_13",
		orgId: "org_10",
		orgName: "CloudSaaS",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[ghi789]",
		sentAt: "2024-04-23T08:10:00Z",
		createdAt: "2024-04-23T08:09:00Z",
	},
	{
		id: "log_14",
		orgId: "org_7",
		orgName: "FinanceApp",
		type: "email",
		status: "failed",
		provider: "resend",
		to: "henry@finance.io",
		subject: "2FA Code",
		createdAt: "2024-04-23T08:00:00Z",
	},
	{
		id: "log_15",
		orgId: "org_3",
		orgName: "Global Retail",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+15557778888",
		sentAt: "2024-04-23T07:50:00Z",
		createdAt: "2024-04-23T07:49:00Z",
	},
	{
		id: "log_16",
		orgId: "org_9",
		orgName: "MediaGroup",
		type: "push",
		status: "sent",
		provider: "expo",
		to: "ExponentPushToken[jkl012]",
		createdAt: "2024-04-23T07:40:00Z",
	},
	{
		id: "log_17",
		orgId: "org_2",
		orgName: "TechStartup Inc",
		type: "email",
		status: "bounced",
		provider: "resend",
		to: "invalid@domain.xyz",
		subject: "Welcome",
		createdAt: "2024-04-23T07:30:00Z",
	},
	{
		id: "log_18",
		orgId: "org_5",
		orgName: "HealthTech",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "ida@healthtech.com",
		subject: "Lab Results Ready",
		sentAt: "2024-04-23T07:20:00Z",
		createdAt: "2024-04-23T07:19:00Z",
	},
	{
		id: "log_19",
		orgId: "org_1",
		orgName: "Acme Corp",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+15551112222",
		sentAt: "2024-04-23T07:10:00Z",
		createdAt: "2024-04-23T07:09:00Z",
	},
	{
		id: "log_20",
		orgId: "org_7",
		orgName: "FinanceApp",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "jack@finance.io",
		subject: "Weekly Report",
		sentAt: "2024-04-23T07:00:00Z",
		createdAt: "2024-04-23T06:59:00Z",
	},
];

export function useLogs(defaultFilters?: LogFilters) {
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState<LogFilters>(defaultFilters ?? {});

	// TODO: replace with trpc.admin.logs.list.useQuery({ page, limit: PAGE_SIZE, ...filters })
	const filtered = MOCK.filter((l) => {
		if (filters.type && l.type !== filters.type) return false;
		if (filters.status && l.status !== filters.status) return false;
		if (filters.orgId && l.orgId !== filters.orgId) return false;
		if (filters.search) {
			const q = filters.search.toLowerCase();
			if (
				!l.to.toLowerCase().includes(q) &&
				!l.orgName.toLowerCase().includes(q)
			)
				return false;
		}
		return true;
	});
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		logs: items,
		total: filtered.length,
		page,
		setPage,
		filters,
		setFilters,
		isLoading: false as const,
		error: null,
	};
}
