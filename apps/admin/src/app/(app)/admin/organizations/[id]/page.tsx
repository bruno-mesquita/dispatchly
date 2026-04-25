"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
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
import Link from "next/link";
import { use, useState } from "react";
import { useLogs } from "@/hooks/use-logs";
import { useOrganization } from "@/hooks/use-organization";
import { useTemplates } from "@/hooks/use-templates";
import { useWebhooks } from "@/hooks/use-webhooks";

type Tab = "logs" | "templates" | "webhooks";

const PLAN_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	free: "secondary",
	basic: "outline",
	pro: "default",
	enterprise: "default",
};

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

function UsageBar({
	label,
	used,
	quota,
}: {
	label: string;
	used: number;
	quota: number;
}) {
	const pct = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
	return (
		<div className="space-y-1">
			<div className="flex justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span>
					{used.toLocaleString()} / {quota.toLocaleString()}
				</span>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary transition-all"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

export default function OrgDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { organization, update, isLoading } = useOrganization(id);
	const { logs } = useLogs({ orgId: id });
	const { templates } = useTemplates(id);
	const { webhooks } = useWebhooks(id);
	const [tab, setTab] = useState<Tab>("logs");
	const [pendingPlan, setPendingPlan] = useState<string | null>(null);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-32 w-full" />
				))}
			</div>
		);
	}

	if (!organization) {
		return <div className="text-muted-foreground">Organization not found.</div>;
	}

	function handleSavePlan() {
		if (pendingPlan) {
			update({ plan: pendingPlan as any });
			setPendingPlan(null);
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<Link
					href={"/admin/organizations" as any}
					className="text-muted-foreground text-sm hover:text-foreground"
				>
					← Back
				</Link>
				<div>
					<h1 className="font-semibold text-2xl">{organization.name}</h1>
					<p className="text-muted-foreground text-sm">{organization.slug}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Info</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Plan</span>
							<Badge variant={PLAN_VARIANT[organization.plan] ?? "secondary"}>
								{organization.plan}
							</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Owner ID</span>
							<span className="font-mono text-xs">{organization.ownerId}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Created</span>
							<span>
								{new Date(organization.createdAt).toLocaleDateString()}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Usage</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<UsageBar
							label="Emails"
							used={organization.usage.emails}
							quota={organization.quota.emails}
						/>
						<UsageBar
							label="SMS"
							used={organization.usage.sms}
							quota={organization.quota.sms}
						/>
						<UsageBar
							label="Push"
							used={organization.usage.push}
							quota={organization.quota.push}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Change Plan</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<Select
							value={pendingPlan ?? organization.plan}
							onValueChange={setPendingPlan}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="free">Free</SelectItem>
								<SelectItem value="basic">Basic</SelectItem>
								<SelectItem value="pro">Pro</SelectItem>
								<SelectItem value="enterprise">Enterprise</SelectItem>
							</SelectContent>
						</Select>
						<Button
							onClick={handleSavePlan}
							disabled={!pendingPlan || pendingPlan === organization.plan}
							className="w-full"
						>
							Save Plan
						</Button>
					</CardContent>
				</Card>
			</div>

			<div>
				<div className="mb-4 flex gap-2 border-b">
					{(["logs", "templates", "webhooks"] as Tab[]).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTab(t)}
							className={`px-4 py-2 text-sm capitalize transition-colors ${
								tab === t
									? "border-primary border-b-2 font-medium text-primary"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{t}
						</button>
					))}
				</div>

				{tab === "logs" && (
					<Card>
						<CardContent className="pt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>To</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Provider</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{logs.slice(0, 10).map((log) => (
										<TableRow key={log.id}>
											<TableCell className="font-mono text-sm">
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
											<TableCell className="text-muted-foreground">
												{log.provider}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(log.createdAt).toLocaleString()}
											</TableCell>
										</TableRow>
									))}
									{logs.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={5}
												className="text-center text-muted-foreground"
											>
												No logs
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}

				{tab === "templates" && (
					<Card>
						<CardContent className="pt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Variables</TableHead>
										<TableHead>Active</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{templates.map((tpl) => (
										<TableRow key={tpl.id}>
											<TableCell className="font-medium">{tpl.name}</TableCell>
											<TableCell>
												<Badge variant="outline">{tpl.type}</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{tpl.variables.join(", ") || "—"}
											</TableCell>
											<TableCell>
												<Badge variant={tpl.isActive ? "default" : "secondary"}>
													{tpl.isActive ? "Active" : "Inactive"}
												</Badge>
											</TableCell>
										</TableRow>
									))}
									{templates.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-center text-muted-foreground"
											>
												No templates
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}

				{tab === "webhooks" && (
					<Card>
						<CardContent className="pt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
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
											<TableCell className="max-w-40 truncate font-mono text-muted-foreground text-xs">
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
												colSpan={5}
												className="text-center text-muted-foreground"
											>
												No webhooks
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
