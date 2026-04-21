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

const PLAN_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	free: "secondary",
	basic: "outline",
	pro: "default",
	enterprise: "default",
};

export function OrganizationsTable() {
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery(
		trpc.admin.organizations.list.queryOptions({ page, limit: 20 }),
	);

	const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Organizations</CardTitle>
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
									<TableHead>Slug</TableHead>
									<TableHead>Plan</TableHead>
									<TableHead>Emails</TableHead>
									<TableHead>SMS</TableHead>
									<TableHead>Push</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.items.map((org: any) => (
									<TableRow key={String(org._id)}>
										<TableCell className="font-medium">{org.name}</TableCell>
										<TableCell className="text-muted-foreground">
											{org.slug}
										</TableCell>
										<TableCell>
											<Badge variant={PLAN_VARIANT[org.plan] ?? "secondary"}>
												{org.plan}
											</Badge>
										</TableCell>
										<TableCell>{org.usage?.emails ?? 0}</TableCell>
										<TableCell>{org.usage?.sms ?? 0}</TableCell>
										<TableCell>{org.usage?.push ?? 0}</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{org.createdAt
												? new Date(org.createdAt).toLocaleDateString()
												: "—"}
										</TableCell>
									</TableRow>
								))}
								{data?.items.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-muted-foreground"
										>
											No organizations found
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
