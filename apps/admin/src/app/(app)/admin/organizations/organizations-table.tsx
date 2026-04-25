"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import { Input } from "@dispatchly/ui/components/input";
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

import { useOrganizations } from "@/hooks/use-organizations";
import { cn } from "@dispatchly/ui/lib/utils";
import { PulseDot } from "@/components/pulse-dot";

const PLAN_VARIANT: Record<
	string,
	string
> = {
	free: "bg-muted text-muted-foreground border-border",
	basic: "bg-accent-tint text-accent border-accent/20",
	pro: "bg-primary text-primary-foreground border-primary",
	enterprise: "bg-primary text-primary-foreground font-bold border-primary",
};

export function OrganizationsTable() {
	const { organizations, total, page, setPage, search, setSearch, isLoading } =
		useOrganizations();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<div className="flex flex-col gap-6">
			{/* Kicker Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
					<span className="text-accent">02</span>
					<span className="h-px w-4 bg-border" />
					<span>Registry</span>
				</div>
				<div className="flex items-center justify-between">
					<h1 className="font-medium text-3xl tracking-tight">Organizations</h1>
					<div className="relative w-64">
						<Input
							placeholder="SEARCH_NODES…"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="h-8 font-mono text-xs uppercase tracking-tight bg-muted/20 border-border"
						/>
						<span className="absolute right-3 top-2 text-[9px] text-muted-foreground pointer-events-none opacity-50">⌘K</span>
					</div>
				</div>
			</div>

			{/* Main Table */}
			<div className="rounded-md border bg-card overflow-hidden">
				<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
					<span>Cluster Nodes</span>
					<div className="flex items-center gap-4">
						<span className="opacity-50">Filter: {search || "ALL"}</span>
						<div className="flex items-center gap-2">
							<PulseDot size={4} />
							<span>Active</span>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="p-4 space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full opacity-50" />
						))}
					</div>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader className="bg-muted/10">
								<TableRow className="hover:bg-transparent border-b">
									<TableHead className="h-9 font-mono text-[10px] uppercase">Identity</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase">Slug</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase text-center">Tier</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase text-center">Resources</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase text-right">Created</TableHead>
									<TableHead className="h-9 w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{organizations.map((org) => (
									<TableRow key={org.id} className="group border-b last:border-0 hover:bg-muted/30 transition-colors">
										<TableCell className="py-3">
											<Link
												href={`/admin/organizations/${org.id}` as any}
												className="font-medium text-sm hover:text-accent transition-colors"
											>
												{org.name}
											</Link>
										</TableCell>
										<TableCell className="py-3">
											<code className="text-[11px] text-muted-foreground group-hover:text-foreground">
												{org.slug}
											</code>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex justify-center">
												<span className={cn(
													"inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
													PLAN_VARIANT[org.plan]
												)}>
													{org.plan}
												</span>
											</div>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex flex-col gap-1 items-center font-mono text-[9px] text-muted-foreground">
												<div className="flex gap-2">
													<span>E: {org.usage.emails}/{org.quota.emails}</span>
													<span>S: {org.usage.sms}/{org.quota.sms}</span>
													<span>P: {org.usage.push}/{org.quota.push}</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
											{new Date(org.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell className="py-3 text-right">
											<Link
												href={`/admin/organizations/${org.id}` as any}
												className="text-muted-foreground hover:text-accent transition-all inline-block"
											>
												<span className="font-mono text-[12px]">→</span>
											</Link>
										</TableCell>
									</TableRow>
								))}
								{organizations.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="h-32 text-center text-muted-foreground font-mono text-xs italic"
										>
											NODE_NOT_FOUND
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}

				<div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
					<div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
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
