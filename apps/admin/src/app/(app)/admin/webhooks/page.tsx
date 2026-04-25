"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
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
import { useWebhooks } from "@/hooks/use-webhooks";

export default function AdminWebhooksPage() {
	const { webhooks, total, page, setPage, isLoading } = useWebhooks();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<div className="flex flex-col gap-6">
			{/* Kicker Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
					<span className="text-accent">07</span>
					<span className="h-px w-4 bg-border" />
					<span>Operational</span>
				</div>
				<h1 className="font-medium text-3xl tracking-tight">Webhooks</h1>
				<p className="text-muted-foreground text-sm">
					Manage and monitor multi-channel delivery hooks.
				</p>
			</div>

			{/* Stats Strip (Optional but looks cool) */}
			<div className="grid grid-cols-4 gap-px overflow-hidden rounded-md border bg-border">
				{[
					{
						label: "Active Hooks",
						value: webhooks.filter((w) => w.isActive).length,
					},
					{ label: "Total Configured", value: total },
					{ label: "Avg Latency", value: "142ms" },
					{ label: "Success Rate", value: "99.8%" },
				].map((stat, i) => (
					<div key={i} className="bg-background p-4">
						<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
							{stat.label}
						</div>
						<div className="mt-1 font-medium text-2xl tracking-tight">
							{stat.value}
						</div>
					</div>
				))}
			</div>

			{/* Main Table */}
			<div className="rounded-md border bg-card">
				<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
					<span>Endpoint Registry</span>
					<div className="flex items-center gap-2">
						<PulseDot size={4} />
						<span>Listening</span>
					</div>
				</div>

				{isLoading ? (
					<div className="space-y-4 p-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full opacity-50" />
						))}
					</div>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader className="bg-muted/20">
								<TableRow className="border-b hover:bg-transparent">
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										Name
									</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										Organization
									</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										URL
									</TableHead>
									<TableHead className="h-9 text-center font-mono text-[10px] uppercase">
										Status
									</TableHead>
									<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
										Last Triggered
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{webhooks.map((wh) => (
									<TableRow
										key={wh.id}
										className="group border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<TableCell className="py-3 font-medium text-sm">
											{wh.name}
										</TableCell>
										<TableCell className="py-3 text-muted-foreground text-sm">
											{wh.orgName}
										</TableCell>
										<TableCell className="py-3">
											<code className="block max-w-xs truncate rounded border border-accent/10 bg-accent-tint px-1.5 py-0.5 text-[11px] text-accent/80">
												{wh.url}
											</code>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex justify-center">
												<div
													className={cn(
														"flex items-center gap-2 rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider",
														wh.isActive
															? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
															: "border-border bg-muted text-muted-foreground",
													)}
												>
													{wh.isActive && (
														<PulseDot size={4} color="currentColor" />
													)}
													{wh.isActive ? "Live" : "Inactive"}
												</div>
											</div>
										</TableCell>
										<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
											{wh.lastTriggeredAt
												? new Date(wh.lastTriggeredAt).toLocaleString([], {
														hour: "2-digit",
														minute: "2-digit",
														second: "2-digit",
														day: "2-digit",
														month: "2-digit",
													})
												: "---"}
										</TableCell>
									</TableRow>
								))}
								{webhooks.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-32 text-center font-mono text-muted-foreground text-xs italic"
										>
											NO_WEBHOOKS_CONFIGURED
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}

				<div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
					<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
						Total: {total} nodes
					</div>
					<div className="flex items-center gap-4">
						<div className="font-mono text-[11px] text-muted-foreground">
							PAGE_{page}_OF_{totalPages}
						</div>
						<div className="flex gap-1">
							<Button
								variant="outline"
								size="sm"
								className="h-7 px-2 font-mono text-[10px] uppercase tracking-wider"
								disabled={page <= 1}
								onClick={() => setPage((p) => p - 1)}
							>
								Prev
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-7 px-2 font-mono text-[10px] uppercase tracking-wider"
								disabled={page >= totalPages}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
