"use client";

import type { NotificationLog } from "./use-logs";
import type { Organization } from "./use-organizations";

const RECENT_ORGS: Organization[] = [
	{
		id: "org_8",
		name: "LocalBusiness",
		slug: "local-biz",
		plan: "free",
		usage: { emails: 12, sms: 5, push: 0 },
		quota: { emails: 100, sms: 20, push: 0 },
		ownerId: "user_8",
		createdAt: "2024-04-01T10:00:00Z",
	},
	{
		id: "org_10",
		name: "CloudSaaS",
		slug: "cloud-saas",
		plan: "basic",
		usage: { emails: 650, sms: 120, push: 85 },
		quota: { emails: 1000, sms: 200, push: 200 },
		ownerId: "user_10",
		createdAt: "2024-03-18T15:00:00Z",
	},
	{
		id: "org_4",
		name: "DevShop",
		slug: "devshop",
		plan: "free",
		usage: { emails: 45, sms: 0, push: 12 },
		quota: { emails: 100, sms: 0, push: 50 },
		ownerId: "user_4",
		createdAt: "2024-03-05T16:45:00Z",
	},
	{
		id: "org_6",
		name: "EduPlatform",
		slug: "edu-platform",
		plan: "basic",
		usage: { emails: 780, sms: 0, push: 230 },
		quota: { emails: 1000, sms: 200, push: 500 },
		ownerId: "user_6",
		createdAt: "2024-02-14T08:00:00Z",
	},
	{
		id: "org_2",
		name: "TechStartup Inc",
		slug: "techstartup",
		plan: "basic",
		usage: { emails: 320, sms: 45, push: 0 },
		quota: { emails: 1000, sms: 200, push: 0 },
		ownerId: "user_2",
		createdAt: "2024-02-20T14:30:00Z",
	},
];

const RECENT_LOGS: NotificationLog[] = [
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
];

// TODO: replace with trpc.admin.analytics.overview.useQuery() + trpc.admin.logs.list + trpc.admin.organizations.list
export function useDashboard() {
	const stats = {
		totalOrgs: 10,
		activeSubs: 6,
		totalNotifs: 58420,
		failedNotifs: 1230,
	};

	return {
		stats,
		recentLogs: RECENT_LOGS,
		recentOrgs: RECENT_ORGS,
		isLoading: false as const,
		error: null,
	};
}
