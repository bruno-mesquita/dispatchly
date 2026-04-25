"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@dispatchly/ui/components/table";
import { cn } from "@dispatchly/ui/lib/utils";
import Link from "next/link";
import { LogStream } from "@/components/log-stream";
import { PulseDot } from "@/components/pulse-dot";
import { useDashboard } from "@/hooks/use-dashboard";

const STATUS_VARIANT: Record<string, string> = {
	pending: "bg-muted text-muted-foreground border-border",
	sent: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
	delivered:
		"bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
	failed: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
	bounced:
		"bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
};

const PLAN_VARIANT: Record<string, string> = {
	free: "bg-muted text-muted-foreground",
	basic: "bg-accent-tint text-accent border-accent/20",
	pro: "bg-primary text-primary-foreground",
	enterprise: "bg-primary text-primary-foreground font-bold",
};

function ConsoleStat({
	title,
	value,
	description,
}: {
	title: string;
	value: number;
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
				<span className="font-medium text-3xl leading-none tracking-tight">
					{value.toLocaleString()}
				</span>
			</div>
		</div>
	);
}

export default function AdminDashboardPage() {
	const { stats, recentLogs, recentOrgs } = useDashboard();

	return (
		<div className="-m-6 flex h-full flex-1 flex-row overflow-hidden">
			{/* Main Content Area */}
			<div className="flex flex-1 flex-col gap-8 overflow-auto p-6">
				{/* Kicker Header */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
						<span className="text-accent">01</span>
						<span className="h-px w-4 bg-border" />
						<span>Overview</span>
					</div>
					<h1 className="font-medium text-3xl tracking-tight">
						System Console
					</h1>
					<p className="text-muted-foreground text-sm">
						Monitoring global dispatches and organization health.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<ConsoleStat
						title="Total Nodes"
						value={stats.totalOrgs}
						description="organizations"
					/>
					<ConsoleStat
						title="Active Subs"
						value={stats.activeSubs}
						description="monetized"
					/>
					<ConsoleStat
						title="Dispatches"
						value={stats.totalNotifs}
						description="all_time"
					/>
					<ConsoleStat
						title="Incidents"
						value={stats.failedNotifs}
						description="fail/bounce"
					/>
				</div>

				{/* Tables Section */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Recent Logs Table (Secondary view, details in right rail) */}
					<div className="flex flex-col rounded-md border bg-card">
						<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							<span>Transaction Flow</span>
							<Link
								href="/admin/logs"
								className="transition-colors hover:text-accent"
							>
								[VIEW_ALL]
							</Link>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="border-b hover:bg-transparent">
										<TableHead className="h-8 font-mono text-[9px] uppercase">
											Identity
										</TableHead>
										<TableHead className="h-8 font-mono text-[9px] uppercase">
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentLogs.map((log) => (
										<TableRow
											key={log.id}
											className="group border-b transition-colors last:border-0 hover:bg-muted/20"
										>
											<TableCell className="py-2.5">
												<div className="flex flex-col">
													<code className="block max-w-[140px] truncate text-[11px] text-foreground">
														{log.to}
													</code>
													<span className="font-mono text-[9px] uppercase opacity-40">
														{log.type} · {log.orgName}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-2.5">
												<span
													className={cn(
														"inline-flex items-center rounded border px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wider",
														STATUS_VARIANT[log.status],
													)}
												>
													{log.status}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>

					{/* Recent Organizations */}
					<div className="flex flex-col rounded-md border bg-card">
						<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							<span>Node Registry</span>
							<Link
								href="/admin/organizations"
								className="transition-colors hover:text-accent"
							>
								[VIEW_ALL]
							</Link>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="border-b hover:bg-transparent">
										<TableHead className="h-8 font-mono text-[9px] uppercase">
											Identity
										</TableHead>
										<TableHead className="h-8 text-right font-mono text-[9px] uppercase">
											Created
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentOrgs.map((org) => (
										<TableRow
											key={org.id}
											className="group border-b transition-colors last:border-0 hover:bg-muted/20"
										>
											<TableCell className="py-2.5">
												<div className="flex items-center gap-2">
													<Link
														href={`/admin/organizations/${org.id}` as any}
														className="font-medium text-sm transition-colors hover:text-accent"
													>
														{org.name}
													</Link>
													<span
														className={cn(
															"inline-flex items-center rounded border px-1 py-0 font-bold text-[8px] uppercase tracking-wider",
															PLAN_VARIANT[org.plan],
														)}
													>
														{org.plan}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-2.5 text-right font-mono text-[10px] text-muted-foreground">
												{new Date(org.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>

			{/* Right Rail: Live Log Stream */}
			<div className="flex hidden w-[340px] shrink-0 flex-col overflow-hidden border-l bg-code-bg xl:flex">
				<div className="flex h-10 items-center justify-between border-white/5 border-b bg-code-bar px-4 font-mono text-[11px] text-code-dim uppercase tracking-wider">
					<div className="flex items-center gap-2">
						<PulseDot size={4} />
						<span className="text-code-fg">Event Stream · tail -f</span>
					</div>
					<div className="opacity-50">⌘K</div>
				</div>
				<div className="flex-1 overflow-hidden p-4">
					<LogStream rows={30} speed={1000} />
				</div>
				<div className="border-white/5 border-t bg-code-bar p-3 text-center">
					<Link
						href="/admin/logs"
						className="font-mono text-[10px] text-code-dim uppercase tracking-widest transition-colors hover:text-code-fg"
					>
						View full trace log →
					</Link>
				</div>
			</div>
		</div>
	);
}
