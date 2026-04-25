"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";
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
import { useSubscriptions } from "@/hooks/use-subscriptions";

const STATUS_VARIANT: Record<string, string> = {
	active:
		"bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
	trialing:
		"bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
	past_due: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
	canceled: "bg-muted text-muted-foreground border-border",
};

export function SubscriptionsTable() {
	const {
		subscriptions,
		total,
		page,
		setPage,
		statusFilter,
		setStatusFilter,
		isLoading,
	} = useSubscriptions();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<div className="flex flex-col gap-6">
			{/* Kicker Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
					<span className="text-accent">04</span>
					<span className="h-px w-4 bg-border" />
					<span>Monetization Registry</span>
				</div>
				<div className="flex items-center justify-between">
					<h1 className="font-medium text-3xl tracking-tight">Subscriptions</h1>
					<div className="flex gap-2">
						<Select
							value={statusFilter}
							onValueChange={(v) => {
								setStatusFilter(v as any);
								setPage(1);
							}}
						>
							<SelectTrigger className="h-8 w-40 border-border bg-muted/20 font-mono text-[10px] uppercase tracking-wider">
								<SelectValue placeholder="STATUS_FILTER" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">ALL_STATUSES</SelectItem>
								<SelectItem value="active">ACTIVE</SelectItem>
								<SelectItem value="trialing">TRIALING</SelectItem>
								<SelectItem value="past_due">PAST_DUE</SelectItem>
								<SelectItem value="canceled">CANCELED</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Main Table */}
			<div className="overflow-hidden rounded-md border bg-card">
				<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
					<span>Billing Nodes</span>
					<div className="flex items-center gap-2">
						<PulseDot size={4} />
						<span>Synced · Stripe</span>
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
							<TableHeader className="bg-muted/10">
								<TableRow className="border-b hover:bg-transparent">
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										Organization
									</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										Plan
									</TableHead>
									<TableHead className="h-9 text-center font-mono text-[10px] uppercase">
										Status
									</TableHead>
									<TableHead className="h-9 text-center font-mono text-[10px] uppercase">
										Renewal
									</TableHead>
									<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
										Gateway ID
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subscriptions.map((sub) => (
									<TableRow
										key={sub.id}
										className="group border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<TableCell className="py-3 font-medium text-sm">
											{sub.orgName}
										</TableCell>
										<TableCell className="py-3">
											<span className="font-mono text-[11px] uppercase opacity-70">
												{sub.plan}
											</span>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex justify-center">
												<span
													className={cn(
														"inline-flex items-center rounded border px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider",
														STATUS_VARIANT[sub.status],
													)}
												>
													{sub.status}
												</span>
											</div>
										</TableCell>
										<TableCell className="py-3 text-center">
											<span className="font-mono text-[11px] text-muted-foreground">
												{new Date(sub.currentPeriodEnd).toLocaleDateString([], {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</span>
										</TableCell>
										<TableCell className="py-3 text-right">
											<code className="text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground">
												{sub.stripeCustomerId}
											</code>
										</TableCell>
									</TableRow>
								))}
								{subscriptions.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-32 text-center font-mono text-muted-foreground text-xs italic"
										>
											NO_SUBSCRIPTIONS_FOUND
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}

				<div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
					<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
						Nodes: {total}
					</div>
					<div className="flex items-center gap-4">
						<div className="font-mono text-[11px] text-muted-foreground uppercase">
							Page_{page}_Of_{totalPages}
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
