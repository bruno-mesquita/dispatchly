"use client";

import { useState } from "react";

export type SubscriptionStatus =
	| "all"
	| "active"
	| "past_due"
	| "canceled"
	| "trialing";

export type Subscription = {
	id: string;
	orgId: string;
	orgName: string;
	plan: string;
	status: Exclude<SubscriptionStatus, "all">;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	stripeCustomerId: string;
	stripeSubscriptionId: string;
};

const PAGE_SIZE = 20;

const MOCK: Subscription[] = [
	{
		id: "sub_1",
		orgId: "org_1",
		orgName: "Acme Corp",
		plan: "pro",
		status: "active",
		currentPeriodStart: "2024-04-01T00:00:00Z",
		currentPeriodEnd: "2024-05-01T00:00:00Z",
		stripeCustomerId: "cus_abc123",
		stripeSubscriptionId: "sub_abc123",
	},
	{
		id: "sub_2",
		orgId: "org_2",
		orgName: "TechStartup Inc",
		plan: "basic",
		status: "trialing",
		currentPeriodStart: "2024-04-10T00:00:00Z",
		currentPeriodEnd: "2024-04-24T00:00:00Z",
		stripeCustomerId: "cus_def456",
		stripeSubscriptionId: "sub_def456",
	},
	{
		id: "sub_3",
		orgId: "org_3",
		orgName: "Global Retail",
		plan: "enterprise",
		status: "active",
		currentPeriodStart: "2024-04-01T00:00:00Z",
		currentPeriodEnd: "2024-05-01T00:00:00Z",
		stripeCustomerId: "cus_ghi789",
		stripeSubscriptionId: "sub_ghi789",
	},
	{
		id: "sub_4",
		orgId: "org_5",
		orgName: "HealthTech",
		plan: "pro",
		status: "past_due",
		currentPeriodStart: "2024-03-01T00:00:00Z",
		currentPeriodEnd: "2024-04-01T00:00:00Z",
		stripeCustomerId: "cus_jkl012",
		stripeSubscriptionId: "sub_jkl012",
	},
	{
		id: "sub_5",
		orgId: "org_7",
		orgName: "FinanceApp",
		plan: "enterprise",
		status: "active",
		currentPeriodStart: "2024-04-01T00:00:00Z",
		currentPeriodEnd: "2024-05-01T00:00:00Z",
		stripeCustomerId: "cus_mno345",
		stripeSubscriptionId: "sub_mno345",
	},
	{
		id: "sub_6",
		orgId: "org_9",
		orgName: "MediaGroup",
		plan: "pro",
		status: "canceled",
		currentPeriodStart: "2024-03-01T00:00:00Z",
		currentPeriodEnd: "2024-04-01T00:00:00Z",
		stripeCustomerId: "cus_pqr678",
		stripeSubscriptionId: "sub_pqr678",
	},
	{
		id: "sub_7",
		orgId: "org_6",
		orgName: "EduPlatform",
		plan: "basic",
		status: "active",
		currentPeriodStart: "2024-04-01T00:00:00Z",
		currentPeriodEnd: "2024-05-01T00:00:00Z",
		stripeCustomerId: "cus_stu901",
		stripeSubscriptionId: "sub_stu901",
	},
	{
		id: "sub_8",
		orgId: "org_10",
		orgName: "CloudSaaS",
		plan: "basic",
		status: "trialing",
		currentPeriodStart: "2024-04-15T00:00:00Z",
		currentPeriodEnd: "2024-04-29T00:00:00Z",
		stripeCustomerId: "cus_vwx234",
		stripeSubscriptionId: "sub_vwx234",
	},
];

export function useSubscriptions() {
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<SubscriptionStatus>("all");

	// TODO: replace with trpc.admin.subscriptions.list.useQuery({ page, limit: PAGE_SIZE, status: statusFilter })
	const filtered =
		statusFilter === "all"
			? MOCK
			: MOCK.filter((s) => s.status === statusFilter);
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		subscriptions: items,
		total: filtered.length,
		page,
		setPage,
		statusFilter,
		setStatusFilter,
		isLoading: false as const,
		error: null,
	};
}
