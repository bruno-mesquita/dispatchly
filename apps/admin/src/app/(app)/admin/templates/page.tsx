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

import { useTemplates } from "@/hooks/use-templates";

const TYPE_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	email: "default",
	sms: "secondary",
	push: "outline",
};

export default function AdminTemplatesPage() {
	const {
		templates,
		total,
		page,
		setPage,
		typeFilter,
		setTypeFilter,
		isLoading,
	} = useTemplates();

	const totalPages = Math.max(1, Math.ceil(total / 20));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Templates</CardTitle>
					<Select
						value={typeFilter}
						onValueChange={(v) => {
							setTypeFilter(v as any);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All types</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="sms">SMS</SelectItem>
							<SelectItem value="push">Push</SelectItem>
						</SelectContent>
					</Select>
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
									<TableHead>Organization</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Variables</TableHead>
									<TableHead>Active</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{templates.map((tpl) => (
									<TableRow key={tpl.id}>
										<TableCell className="font-medium">{tpl.name}</TableCell>
										<TableCell className="text-muted-foreground">
											{tpl.orgName}
										</TableCell>
										<TableCell>
											<Badge variant={TYPE_VARIANT[tpl.type] ?? "secondary"}>
												{tpl.type}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{tpl.variables.length > 0
												? tpl.variables.join(", ")
												: "—"}
										</TableCell>
										<TableCell>
											<Badge variant={tpl.isActive ? "default" : "secondary"}>
												{tpl.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{new Date(tpl.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
								{templates.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center text-muted-foreground"
										>
											No templates found
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
