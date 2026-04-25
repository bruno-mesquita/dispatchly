"use client";

export type AnalyticsOverview = {
	totalOrgs: number;
	activeSubs: number;
	totalNotifs: number;
	failedNotifs: number;
};

export type PlanCount = { plan: string; count: number };
export type TypeCount = { type: string; count: number };
export type StatusCount = { status: string; count: number };
export type DailyPoint = {
	date: string;
	emails: number;
	sms: number;
	push: number;
};

function generateDailyTrend(): DailyPoint[] {
	const points: DailyPoint[] = [];
	const now = new Date("2024-04-23");
	for (let i = 29; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(d.getDate() - i);
		points.push({
			date: d.toISOString().split("T")[0] as string,
			emails: Math.floor(Math.random() * 800) + 200,
			sms: Math.floor(Math.random() * 300) + 50,
			push: Math.floor(Math.random() * 200) + 30,
		});
	}
	return points;
}

const DAILY_TREND = generateDailyTrend();

// TODO: replace with trpc.admin.analytics.overview.useQuery()
export function useAnalytics() {
	const overview: AnalyticsOverview = {
		totalOrgs: 10,
		activeSubs: 6,
		totalNotifs: 58420,
		failedNotifs: 1230,
	};

	const orgsByPlan: PlanCount[] = [
		{ plan: "free", count: 2 },
		{ plan: "basic", count: 3 },
		{ plan: "pro", count: 3 },
		{ plan: "enterprise", count: 2 },
	];

	const notifByType: TypeCount[] = [
		{ type: "email", count: 38200 },
		{ type: "sms", count: 13800 },
		{ type: "push", count: 6420 },
	];

	const notifByStatus: StatusCount[] = [
		{ status: "delivered", count: 48900 },
		{ status: "sent", count: 6200 },
		{ status: "failed", count: 980 },
		{ status: "bounced", count: 250 },
		{ status: "pending", count: 2090 },
	];

	const topOrgs = [
		{
			id: "org_7",
			name: "FinanceApp",
			emails: 32000,
			sms: 8900,
			push: 0,
			total: 40900,
		},
		{
			id: "org_3",
			name: "Global Retail",
			emails: 18500,
			sms: 3200,
			push: 5600,
			total: 27300,
		},
		{
			id: "org_9",
			name: "MediaGroup",
			emails: 4200,
			sms: 0,
			push: 1800,
			total: 6000,
		},
		{
			id: "org_5",
			name: "HealthTech",
			emails: 2800,
			sms: 1200,
			push: 400,
			total: 4400,
		},
		{
			id: "org_1",
			name: "Acme Corp",
			emails: 1250,
			sms: 340,
			push: 890,
			total: 2480,
		},
	];

	return {
		overview,
		orgsByPlan,
		notifByType,
		notifByStatus,
		dailyTrend: DAILY_TREND,
		topOrgs,
		isLoading: false as const,
		error: null,
	};
}
