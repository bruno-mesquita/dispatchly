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

import { useWebhooks } from "@/hooks/use-webhooks";

export default function AdminWebhooksPage() {
	const { webhooks, total, page, setPage, isLoading } = useWebhooks();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Webhooks</CardTitle>
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
									<TableHead>Name</TableHead>
									<TableHead>Organization</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Events</TableHead>
									<TableHead>Active</TableHead>
									<TableHead>Last Triggered</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{webhooks.map((wh) => (
									<TableRow key={wh.id}>
										<TableCell className="font-medium">{wh.name}</TableCell>
										<TableCell className="text-muted-foreground">
											{wh.orgName}
										</TableCell>
										<TableCell className="max-w-48 truncate font-mono text-muted-foreground text-xs">
											{wh.url}
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{wh.events.length} event
											{wh.events.length !== 1 ? "s" : ""}
										</TableCell>
										<TableCell>
											<Badge variant={wh.isActive ? "default" : "secondary"}>
												{wh.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{wh.lastTriggeredAt
												? new Date(wh.lastTriggeredAt).toLocaleString()
												: "Never"}
										</TableCell>
									</TableRow>
								))}
								{webhooks.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center text-muted-foreground"
										>
											No webhooks found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
						<div className="mt-4 flex items-center justify-between">
							<span className="text-muted-foreground text-sm">
								{total} total
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
