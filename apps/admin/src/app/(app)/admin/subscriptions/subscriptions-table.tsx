"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "@/utils/trpc";

const STATUS_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	active: "default",
	trialing: "secondary",
	past_due: "destructive",
	canceled: "outline",
};

export function SubscriptionsTable() {
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery(
		trpc.admin.subscriptions.list.queryOptions({ page, limit: 20 }),
	);

	const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Subscriptions</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full" />
						))}
					</div>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Organization</TableHead>
									<TableHead>Plan</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Period End</TableHead>
									<TableHead>Stripe Customer</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.items.map((sub: any) => (
									<TableRow key={String(sub._id)}>
										<TableCell className="font-medium">{sub.orgName}</TableCell>
										<TableCell>{sub.plan}</TableCell>
										<TableCell>
											<Badge
												variant={STATUS_VARIANT[sub.status] ?? "secondary"}
											>
												{sub.status}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{sub.currentPeriodEnd
												? new Date(sub.currentPeriodEnd).toLocaleDateString()
												: "—"}
										</TableCell>
										<TableCell className="font-mono text-muted-foreground text-xs">
											{sub.stripeCustomerId ?? "—"}
										</TableCell>
									</TableRow>
								))}
								{data?.items.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center text-muted-foreground"
										>
											No subscriptions found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
						<div className="mt-4 flex items-center justify-between">
							<span className="text-muted-foreground text-sm">
								{data?.total ?? 0} total
							</span>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={page <= 1}
									onClick={() => setPage((p) => p - 1)}
								>
									Previous
								</Button>
								<span className="self-center text-sm">
									{page} / {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									disabled={page >= totalPages}
									onClick={() => setPage((p) => p + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
