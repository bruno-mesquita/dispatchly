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

import { useDashboardOverview } from "@/hooks/use-dashboard-overview";

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

function StatCard({
	title,
	value,
	description,
}: {
	title: string;
	value: string | number;
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

export function DashboardOverview() {
	const { stats, byType, recentLogs } = useDashboardOverview();

	return (
		<div className="space-y-8 p-8">
			<h1 className="font-semibold text-2xl">Visão Geral</h1>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<StatCard
					title="Enviadas"
					value={stats.totalSent}
					description="total"
				/>
				<StatCard title="Entregues" value={stats.delivered} />
				<StatCard title="Falhas" value={stats.failed} />
				<StatCard title="Taxa de Entrega" value={`${stats.deliveryRate}%`} />
			</div>

			<div className="grid grid-cols-3 gap-4">
				<StatCard title="Email" value={byType.email} />
				<StatCard title="SMS" value={byType.sms} />
				<StatCard title="Push" value={byType.push} />
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Link
					href={"/dashboard/send" as any}
					className="flex items-center justify-center rounded-lg border p-6 text-center transition-colors hover:bg-accent"
				>
					<div>
						<p className="font-semibold">Enviar Notificação</p>
						<p className="mt-1 text-muted-foreground text-sm">Envio único</p>
					</div>
				</Link>
				<Link
					href={"/dashboard/batch" as any}
					className="flex items-center justify-center rounded-lg border p-6 text-center transition-colors hover:bg-accent"
				>
					<div>
						<p className="font-semibold">Envio em Lote</p>
						<p className="mt-1 text-muted-foreground text-sm">CSV ou JSON</p>
					</div>
				</Link>
				<Link
					href={"/dashboard/templates" as any}
					className="flex items-center justify-center rounded-lg border p-6 text-center transition-colors hover:bg-accent"
				>
					<div>
						<p className="font-semibold">Templates</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Gerenciar templates
						</p>
					</div>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Últimos Logs</CardTitle>
						<Link
							href={"/dashboard/logs" as any}
							className="text-muted-foreground text-sm hover:underline"
						>
							Ver todos →
						</Link>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Destinatário</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Enviado em</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentLogs.map((log) => (
								<TableRow key={log.id}>
									<TableCell className="max-w-40 truncate font-mono text-sm">
										{log.to}
									</TableCell>
									<TableCell>
										<Badge variant="outline">{log.type}</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={STATUS_VARIANT[log.status] ?? "secondary"}>
											{log.status}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{new Date(log.createdAt).toLocaleString("pt-BR")}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
