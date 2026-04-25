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

import { useDashboard } from "@/hooks/use-dashboard";

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

const PLAN_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	free: "secondary",
	basic: "outline",
	pro: "default",
	enterprise: "default",
};

function StatCard({
	title,
	value,
	description,
}: {
	title: string;
	value: number;
	description?: string;
}) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="font-bold text-3xl">{value.toLocaleString()}</p>
				{description && (
					<p className="mt-1 text-muted-foreground text-xs">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}

export default function AdminDashboardPage() {
	const { stats, recentLogs, recentOrgs } = useDashboard();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="mb-6 font-semibold text-2xl">Dashboard</h1>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<StatCard title="Total Organizations" value={stats.totalOrgs} />
					<StatCard title="Active Subscriptions" value={stats.activeSubs} />
					<StatCard
						title="Total Notifications"
						value={stats.totalNotifs}
						description="all time"
					/>
					<StatCard
						title="Failed / Bounced"
						value={stats.failedNotifs}
						description="all time"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">Recent Logs</CardTitle>
							<Link
								href={"/admin/logs" as any}
								className="text-muted-foreground text-sm hover:underline"
							>
								View all →
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>To</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Org</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentLogs.map((log) => (
									<TableRow key={log.id}>
										<TableCell className="max-w-32 truncate font-mono text-sm">
											{log.to}
										</TableCell>
										<TableCell>
											<Badge variant="outline">{log.type}</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={STATUS_VARIANT[log.status] ?? "secondary"}
											>
												{log.status}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{log.orgName}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">Recent Organizations</CardTitle>
							<Link
								href={"/admin/organizations" as any}
								className="text-muted-foreground text-sm hover:underline"
							>
								View all →
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Plan</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentOrgs.map((org) => (
									<TableRow key={org.id}>
										<TableCell className="font-medium">
											<Link
												href={`/admin/organizations/${org.id}` as any}
												className="hover:underline"
											>
												{org.name}
											</Link>
										</TableCell>
										<TableCell>
											<Badge variant={PLAN_VARIANT[org.plan] ?? "secondary"}>
												{org.plan}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{new Date(org.createdAt).toLocaleDateString()}
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
