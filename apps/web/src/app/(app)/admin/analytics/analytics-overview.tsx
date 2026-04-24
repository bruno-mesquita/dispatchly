"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { Skeleton } from "@dispatchly/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

function StatCard({ title, value }: { title: string; value: string | number }) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="font-bold text-3xl">{value}</p>
			</CardContent>
		</Card>
	);
}

export function AnalyticsOverview() {
	const { data, isLoading } = useQuery(
		trpc.admin.analytics.overview.queryOptions(),
	);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-28 w-full" />
					))}
				</div>
			</div>
		);
	}

	const planMap: Record<string, number> = {};
	for (const p of data?.orgsByPlan ?? []) {
		planMap[p._id ?? "unknown"] = p.count;
	}

	const notifTotals: Record<string, number> = {};
	for (const n of data?.notifByTypeStatus ?? []) {
		const key = n._id?.type ?? "unknown";
		notifTotals[key] = (notifTotals[key] ?? 0) + n.count;
	}

	const deliveredCount = (data?.notifByTypeStatus ?? [])
		.filter((n: any) => n._id?.status === "delivered")
		.reduce((sum: number, n: any) => sum + n.count, 0);

	const failedCount = (data?.notifByTypeStatus ?? [])
		.filter(
			(n: any) => n._id?.status === "failed" || n._id?.status === "bounced",
		)
		.reduce((sum: number, n: any) => sum + n.count, 0);

	return (
		<div className="space-y-8">
			<div>
				<h2 className="mb-4 font-semibold text-lg">Overview</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<StatCard title="Total Organizations" value={data?.totalOrgs ?? 0} />
					<StatCard
						title="Active Subscriptions"
						value={data?.activeSubs ?? 0}
					/>
					<StatCard title="Total Notifications" value={data?.totalLogs ?? 0} />
					<StatCard title="Delivered" value={deliveredCount} />
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-semibold text-lg">Organizations by Plan</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{["free", "basic", "pro", "enterprise"].map((plan) => (
						<StatCard
							key={plan}
							title={plan.charAt(0).toUpperCase() + plan.slice(1)}
							value={planMap[plan] ?? 0}
						/>
					))}
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-semibold text-lg">Notifications by Channel</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<StatCard title="Email" value={notifTotals.email ?? 0} />
					<StatCard title="SMS" value={notifTotals.sms ?? 0} />
					<StatCard title="Push" value={notifTotals.push ?? 0} />
					<StatCard title="Failed / Bounced" value={failedCount} />
				</div>
			</div>
		</div>
	);
}
