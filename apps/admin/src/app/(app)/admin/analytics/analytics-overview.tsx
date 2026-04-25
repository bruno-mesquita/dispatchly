"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { Skeleton } from "@dispatchly/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@dispatchly/ui/components/table";

import { useAnalytics } from "@/hooks/use-analytics";

function StatCard({ title, value }: { title: string; value: string | number }) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="font-bold text-3xl">{value.toLocaleString()}</p>
			</CardContent>
		</Card>
	);
}

export function AnalyticsOverview() {
	const {
		overview,
		orgsByPlan,
		notifByType,
		notifByStatus,
		topOrgs,
		isLoading,
	} = useAnalytics();

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

	return (
		<div className="space-y-8">
			<div>
				<h2 className="mb-4 font-semibold text-lg">Overview</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<StatCard title="Total Organizations" value={overview.totalOrgs} />
					<StatCard title="Active Subscriptions" value={overview.activeSubs} />
					<StatCard title="Total Notifications" value={overview.totalNotifs} />
					<StatCard title="Failed / Bounced" value={overview.failedNotifs} />
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-semibold text-lg">Organizations by Plan</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{orgsByPlan.map((p) => (
						<StatCard
							key={p.plan}
							title={p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}
							value={p.count}
						/>
					))}
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-semibold text-lg">Notifications by Channel</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{notifByType.map((t) => (
						<StatCard
							key={t.type}
							title={t.type.charAt(0).toUpperCase() + t.type.slice(1)}
							value={t.count}
						/>
					))}
					{notifByStatus
						.filter((s) => s.status === "failed" || s.status === "bounced")
						.slice(0, 1)
						.map(() => (
							<StatCard
								key="failed"
								title="Failed / Bounced"
								value={overview.failedNotifs}
							/>
						))}
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-semibold text-lg">
					Top Organizations by Usage
				</h2>
				<Card>
					<CardContent className="pt-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Organization</TableHead>
									<TableHead>Emails</TableHead>
									<TableHead>SMS</TableHead>
									<TableHead>Push</TableHead>
									<TableHead>Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topOrgs.map((org) => (
									<TableRow key={org.id}>
										<TableCell className="font-medium">{org.name}</TableCell>
										<TableCell>{org.emails.toLocaleString()}</TableCell>
										<TableCell>{org.sms.toLocaleString()}</TableCell>
										<TableCell>{org.push.toLocaleString()}</TableCell>
										<TableCell className="font-semibold">
											{org.total.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
