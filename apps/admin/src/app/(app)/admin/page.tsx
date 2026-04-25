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
import Link from "next/link";

import { useDashboard } from "@/hooks/use-dashboard";
import { PulseDot } from "@/components/pulse-dot";
import { LogStream } from "@/components/log-stream";
import { cn } from "@dispatchly/ui/lib/utils";

const STATUS_VARIANT: Record<
	string,
	string
> = {
	pending: "bg-muted text-muted-foreground border-border",
	sent: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
	delivered: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
	failed: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
	bounced: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
};

const PLAN_VARIANT: Record<
	string,
	string
> = {
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
		<div className="bg-background border p-4 rounded-md">
			<div className="flex justify-between items-start">
				<div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
					{title}
				</div>
				{description && (
					<div className="font-mono text-[9px] text-accent uppercase opacity-70 italic">
						{description}
					</div>
				)}
			</div>
			<div className="mt-2 flex items-baseline gap-1">
				<span className="font-medium text-3xl tracking-tight leading-none">
					{value.toLocaleString()}
				</span>
			</div>
		</div>
	);
}

export default function AdminDashboardPage() {
	const { stats, recentLogs, recentOrgs } = useDashboard();

	return (
		<div className="flex flex-1 flex-row h-full overflow-hidden -m-6">
			{/* Main Content Area */}
			<div className="flex-1 overflow-auto p-6 flex flex-col gap-8">
				{/* Kicker Header */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
						<span className="text-accent">01</span>
						<span className="h-px w-4 bg-border" />
						<span>Overview</span>
					</div>
					<h1 className="font-medium text-3xl tracking-tight">System Console</h1>
					<p className="text-muted-foreground text-sm">
						Monitoring global dispatches and organization health.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<ConsoleStat title="Total Nodes" value={stats.totalOrgs} description="organizations" />
					<ConsoleStat title="Active Subs" value={stats.activeSubs} description="monetized" />
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
					<div className="rounded-md border bg-card flex flex-col">
						<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
							<span>Transaction Flow</span>
							<Link href="/admin/logs" className="hover:text-accent transition-colors">
								[VIEW_ALL]
							</Link>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="hover:bg-transparent border-b">
										<TableHead className="h-8 font-mono text-[9px] uppercase">Identity</TableHead>
										<TableHead className="h-8 font-mono text-[9px] uppercase">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentLogs.map((log) => (
										<TableRow key={log.id} className="group border-b last:border-0 hover:bg-muted/20 transition-colors">
											<TableCell className="py-2.5">
												<div className="flex flex-col">
													<code className="text-[11px] truncate block max-w-[140px] text-foreground">
														{log.to}
													</code>
													<span className="font-mono text-[9px] uppercase opacity-40">
														{log.type} · {log.orgName}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-2.5">
												<span className={cn(
													"inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
													STATUS_VARIANT[log.status]
												)}>
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
					<div className="rounded-md border bg-card flex flex-col">
						<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
							<span>Node Registry</span>
							<Link href="/admin/organizations" className="hover:text-accent transition-colors">
								[VIEW_ALL]
							</Link>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="hover:bg-transparent border-b">
										<TableHead className="h-8 font-mono text-[9px] uppercase">Identity</TableHead>
										<TableHead className="h-8 font-mono text-[9px] uppercase text-right">Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentOrgs.map((org) => (
										<TableRow key={org.id} className="group border-b last:border-0 hover:bg-muted/20 transition-colors">
											<TableCell className="py-2.5">
												<div className="flex items-center gap-2">
													<Link
														href={`/admin/organizations/${org.id}` as any}
														className="font-medium text-sm hover:text-accent transition-colors"
													>
														{org.name}
													</Link>
													<span className={cn(
														"inline-flex items-center px-1 py-0 rounded text-[8px] font-bold uppercase tracking-wider border",
														PLAN_VARIANT[org.plan]
													)}>
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
			<div className="w-[340px] shrink-0 border-l bg-code-bg flex flex-col overflow-hidden hidden xl:flex">
				<div className="flex h-10 items-center justify-between border-b border-white/5 bg-code-bar px-4 font-mono text-[11px] uppercase tracking-wider text-code-dim">
					<div className="flex items-center gap-2">
						<PulseDot size={4} />
						<span className="text-code-fg">Event Stream · tail -f</span>
					</div>
					<div className="opacity-50">⌘K</div>
				</div>
				<div className="flex-1 overflow-hidden p-4">
					<LogStream rows={30} speed={1000} />
				</div>
				<div className="border-t border-white/5 bg-code-bar p-3 text-center">
					<Link href="/admin/logs" className="font-mono text-[10px] uppercase tracking-widest text-code-dim hover:text-code-fg transition-colors">
						View full trace log →
					</Link>
				</div>
			</div>
		</div>
	);
}
