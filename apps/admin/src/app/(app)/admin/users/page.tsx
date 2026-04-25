"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
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

import { useUsers } from "@/hooks/use-users";

export default function AdminUsersPage() {
	const { users, total, page, setPage, search, setSearch, isLoading } =
		useUsers();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Users</CardTitle>
					<Input
						placeholder="Search by name or email…"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="w-64"
					/>
				</div>
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
									<TableHead>Email</TableHead>
									<TableHead>Verified</TableHead>
									<TableHead>Sessions</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="font-medium">{user.name}</TableCell>
										<TableCell className="font-mono text-sm">
											{user.email}
										</TableCell>
										<TableCell>
											<Badge
												variant={user.emailVerified ? "default" : "secondary"}
											>
												{user.emailVerified ? "Verified" : "Unverified"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{user.sessionCount}
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{new Date(user.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
								{users.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center text-muted-foreground"
										>
											No users found
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
