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
import { cn } from "@dispatchly/ui/lib/utils";
import { PulseDot } from "@/components/pulse-dot";
import { useUsers } from "@/hooks/use-users";

export default function AdminUsersPage() {
	const { users, total, page, setPage, search, setSearch, isLoading } =
		useUsers();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<div className="flex flex-col gap-6">
			{/* Kicker Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
					<span className="text-accent">03</span>
					<span className="h-px w-4 bg-border" />
					<span>Identity Registry</span>
				</div>
				<div className="flex items-center justify-between">
					<h1 className="font-medium text-3xl tracking-tight">Users</h1>
					<div className="relative w-64">
						<Input
							placeholder="SEARCH_IDENTITIES…"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="h-8 border-border bg-muted/20 font-mono text-xs uppercase tracking-tight"
						/>
					</div>
				</div>
			</div>

			{/* Main Table */}
			<div className="overflow-hidden rounded-md border bg-card">
				<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
					<span>Active Identities</span>
					<div className="flex items-center gap-2">
						<PulseDot size={4} />
						<span>Synced</span>
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
										Profile
									</TableHead>
									<TableHead className="h-9 font-mono text-[10px] uppercase">
										Email
									</TableHead>
									<TableHead className="h-9 text-center font-mono text-[10px] uppercase">
										Status
									</TableHead>
									<TableHead className="h-9 text-center font-mono text-[10px] uppercase">
										Sessions
									</TableHead>
									<TableHead className="h-9 text-right font-mono text-[10px] uppercase">
										Created
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow
										key={user.id}
										className="group border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<TableCell className="py-3 font-medium text-sm">
											{user.name}
										</TableCell>
										<TableCell className="py-3">
											<code className="text-[11px] text-muted-foreground group-hover:text-foreground">
												{user.email}
											</code>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex justify-center">
												<span
													className={cn(
														"inline-flex items-center rounded border px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider",
														user.emailVerified
															? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
															: "border-border bg-muted text-muted-foreground",
													)}
												>
													{user.emailVerified ? "Verified" : "Pending"}
												</span>
											</div>
										</TableCell>
										<TableCell className="py-3 text-center">
											<span className="font-mono text-[11px] opacity-70">
												{user.sessionCount}
											</span>
										</TableCell>
										<TableCell className="py-3 text-right font-mono text-[11px] text-muted-foreground">
											{new Date(user.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
								{users.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-32 text-center font-mono text-muted-foreground text-xs italic"
										>
											IDENTITY_NOT_FOUND
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}

				<div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
					<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
						Identities: {total}
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
