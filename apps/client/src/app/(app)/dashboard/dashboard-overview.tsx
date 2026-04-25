"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@dispatchly/ui/components/table";
import Link from "next/link";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";
import { Sparkline } from "@/components/sparkline";
import { Kicker } from "@/components/kicker";
import { PulseDot } from "@/components/pulse-dot";

const STATUS_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	pending: "secondary",
	sent: "outline",
	delivered: "default",
	failed: "destructive",
	bounced: "destructive",
};

function StatCard({
	title,
	value,
	delta,
	sparklineData,
}: {
	title: string;
	value: string | number;
	delta?: number;
	sparklineData?: number[];
}) {
	return (
		<Card className="overflow-hidden border-hairline bg-muted/5 shadow-none">
			<CardHeader className="p-4 pb-0">
				<div className="flex items-center justify-between">
					<span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
						{title}
					</span>
					{delta !== undefined && (
						<span
							className={`font-mono text-[10px] ${delta >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{delta >= 0 ? "+" : ""}
							{delta}%
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-2">
				<div className="flex items-end justify-between gap-4">
					<p className="font-sans text-2xl font-medium tracking-tight">
						{value.toLocaleString()}
					</p>
					{sparklineData && (
						<div className="mb-1">
							<Sparkline
								data={sparklineData}
								width={80}
								height={24}
								color="var(--color-primary)"
								fill
							/>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function DashboardOverview() {
	const { stats, byType, recentLogs } = useDashboardOverview();

	// Mocked sparkline data for aesthetic consistency
	const mockSparklines = {
		sent: [12, 15, 14, 18, 22, 21, 25, 28, 30, 32],
		delivered: [98, 97, 99, 99, 98, 99, 99, 99, 99, 99],
		failed: [5, 4, 3, 4, 2, 3, 1, 2, 1, 1],
		rate: [85, 86, 88, 87, 89, 90, 88, 89, 90, 88],
	};

	return (
		<div className="space-y-8 p-6 lg:p-10">
			<header>
				<Kicker num="01" label="System Overview" />
				<h1 className="font-sans text-4xl font-medium tracking-tight">
					Dispatches, logs, and deliverability —{" "}
					<span className="text-muted-foreground">in one console.</span>
				</h1>
			</header>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="dispatches · 24h"
					value={stats.totalSent}
					delta={12}
					sparklineData={mockSparklines.sent}
				/>
				<StatCard
					title="delivered"
					value={stats.delivered}
					delta={0.2}
					sparklineData={mockSparklines.delivered}
				/>
				<StatCard
					title="errors"
					value={stats.failed}
					delta={-42}
					sparklineData={mockSparklines.failed}
				/>
				<StatCard
					title="success rate"
					value={`${stats.deliveryRate}%`}
					delta={1.5}
					sparklineData={mockSparklines.rate}
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-6">
					<Card className="border-hairline bg-muted/5 shadow-none">
						<CardHeader className="flex flex-row items-center justify-between border-b p-4 px-6">
							<div className="flex items-center gap-3">
								<PulseDot size={5} />
								<CardTitle className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground">
									Live Activity · Real-time
								</CardTitle>
							</div>
							<Link
								href={"/dashboard/logs" as any}
								className="font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline"
							>
								Trace all dispatches →
							</Link>
						</CardHeader>
						<CardContent className="p-0">
							<Table>
								<TableHeader className="bg-muted/30">
									<TableRow className="border-none hover:bg-transparent">
										<TableHead className="h-9 px-6 font-mono text-[10px] tracking-wider uppercase">
											Recipient
										</TableHead>
										<TableHead className="h-9 font-mono text-[10px] tracking-wider uppercase">
											Type
										</TableHead>
										<TableHead className="h-9 font-mono text-[10px] tracking-wider uppercase text-center">
											Status
										</TableHead>
										<TableHead className="h-9 px-6 font-mono text-[10px] tracking-wider uppercase text-right">
											Timestamp
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentLogs.map((log) => (
										<TableRow key={log.id} className="border-muted/10 group">
											<TableCell className="max-w-40 truncate px-6 font-mono text-[12px] opacity-80 group-hover:opacity-100 transition-opacity">
												{log.to}
											</TableCell>
											<TableCell className="font-mono text-[10px] tracking-wider uppercase opacity-60">
												{log.type}
											</TableCell>
											<TableCell className="text-center">
												<Badge
													variant={STATUS_VARIANT[log.status] ?? "secondary"}
													className="h-5 px-1.5 font-mono text-[9px] tracking-tight uppercase"
												>
													{log.status}
												</Badge>
											</TableCell>
											<TableCell className="px-6 text-right font-mono text-[11px] text-muted-foreground opacity-60">
												{new Date(log.createdAt).toLocaleTimeString("pt-BR", {
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<div className="space-y-4">
						<Kicker num="02" label="Quick Actions" />
						<div className="grid gap-3">
							{[
								{
									href: "/dashboard/send",
									label: "New Dispatch",
									sub: "One-off message",
								},
								{
									href: "/dashboard/batch",
									label: "Batch Send",
									sub: "CSV / JSON ingest",
								},
								{
									href: "/dashboard/templates",
									label: "Manage Templates",
									sub: "Edit layouts",
								},
							].map((action) => (
								<Link
									key={action.href}
									href={action.href as any}
									className="group flex items-center justify-between rounded-md border border-hairline bg-muted/5 p-4 transition-all hover:bg-accent"
								>
									<div className="space-y-0.5">
										<p className="font-sans font-medium text-[14px]">
											{action.label}
										</p>
										<p className="font-mono text-[11px] text-muted-foreground opacity-60">
											{action.sub}
										</p>
									</div>
									<span className="font-mono text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
										→
									</span>
								</Link>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<Kicker num="03" label="Channel Mix" />
						<div className="grid grid-cols-3 gap-2">
							<div className="rounded-md border border-hairline bg-muted/5 p-3 text-center">
								<p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
									Email
								</p>
								<p className="font-sans text-lg font-medium">{byType.email}</p>
							</div>
							<div className="rounded-md border border-hairline bg-muted/5 p-3 text-center">
								<p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
									SMS
								</p>
								<p className="font-sans text-lg font-medium">{byType.sms}</p>
							</div>
							<div className="rounded-md border border-hairline bg-muted/5 p-3 text-center">
								<p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
									Push
								</p>
								<p className="font-sans text-lg font-medium">{byType.push}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
