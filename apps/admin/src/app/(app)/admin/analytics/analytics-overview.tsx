"use client";

import { Skeleton } from "@dispatchly/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@dispatchly/ui/components/table";
import { cn } from "@dispatchly/ui/lib/utils";
import { PulseDot } from "@/components/pulse-dot";
import { useAnalytics } from "@/hooks/use-analytics";

function ConsoleStat({
	title,
	value,
	description,
}: {
	title: string;
	value: string | number;
	description?: string;
}) {
	return (
		<div className="rounded-md border bg-background p-4">
			<div className="flex items-start justify-between">
				<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
					{title}
				</div>
				{description && (
					<div className="font-mono text-[9px] text-accent uppercase italic opacity-70">
						{description}
					</div>
				)}
			</div>
			<div className="mt-2 flex items-baseline gap-1">
				<span className="font-medium text-2xl leading-none tracking-tight">
					{value.toLocaleString()}
				</span>
			</div>
		</div>
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
			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full opacity-50" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			{/* Kicker Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
					<span className="text-accent">08</span>
					<span className="h-px w-4 bg-border" />
					<span>Deep Analytics</span>
				</div>
				<h1 className="font-medium text-3xl tracking-tight">
					System Performance
				</h1>
				<p className="text-muted-foreground text-sm">
					Real-time resource utilization and throughput metrics.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8">
				{/* Section 1: Overview */}
				<div className="flex flex-col gap-4">
					<div className="font-bold font-mono text-[11px] text-accent uppercase tracking-widest">
						[OVERVIEW_METRICS]
					</div>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<ConsoleStat
							title="Total Nodes"
							value={overview.totalOrgs}
							description="orgs"
						/>
						<ConsoleStat
							title="Active Subs"
							value={overview.activeSubs}
							description="monetized"
						/>
						<ConsoleStat
							title="Dispatches"
							value={overview.totalNotifs}
							description="cumulative"
						/>
						<ConsoleStat
							title="Incidents"
							value={overview.failedNotifs}
							description="fail/bounce"
						/>
					</div>
				</div>

				{/* Section 2: Distribution Grid */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div className="flex flex-col gap-4">
						<div className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
							[PLAN_DISTRIBUTION]
						</div>
						<div className="grid grid-cols-2 gap-3">
							{orgsByPlan.map((p) => (
								<ConsoleStat
									key={p.plan}
									title={p.plan}
									value={p.count}
									description="tier"
								/>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<div className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
							[CHANNEL_THROUGHPUT]
						</div>
						<div className="grid grid-cols-2 gap-3">
							{notifByType.map((t) => (
								<ConsoleStat
									key={t.type}
									title={t.type}
									value={t.count}
									description="channel"
								/>
							))}
						</div>
					</div>
				</div>

				{/* Section 3: Usage Table */}
				<div className="flex flex-col gap-4">
					<div className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
						[TOP_UTILIZATION_NODES]
					</div>
					<div className="overflow-hidden rounded-md border bg-card">
						<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							<span>Resource Consumption</span>
							<div className="flex items-center gap-2">
								<PulseDot size={4} />
								<span>Aggregated</span>
							</div>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="border-b hover:bg-transparent">
										<TableHead className="h-9 font-mono text-[10px] uppercase">
											Organization
										</TableHead>
										<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
											Email
										</TableHead>
										<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
											SMS
										</TableHead>
										<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
											Push
										</TableHead>
										<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
											Total Load
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{topOrgs.map((org) => (
										<TableRow
											key={org.id}
											className="group border-b transition-colors last:border-0 hover:bg-muted/30"
										>
											<TableCell className="py-3 font-medium text-sm">
												{org.name}
											</TableCell>
											<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
												{org.emails.toLocaleString()}
											</TableCell>
											<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
												{org.sms.toLocaleString()}
											</TableCell>
											<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
												{org.push.toLocaleString()}
											</TableCell>
											<TableCell className="py-3 text-right font-bold font-mono text-[11px] text-accent">
												{org.total.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
