"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export function NotificationLogs() {
	const logs = useQuery(trpc.notifications.list.queryOptions({ limit: 50 }));
	const logsData = logs.data as any[] | undefined;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Histórico de Notificações</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{logsData?.map((log: any) => (
						<div
							key={log._id?.toString()}
							className="flex items-center justify-between rounded border p-3"
						>
							<div className="flex-1">
								<p className="font-medium">
									{log.type?.toUpperCase()} → {log.to}
								</p>
								<p className="truncate text-muted-foreground text-sm">
									{log.subject || log.content}
								</p>
							</div>
							<div className="text-right">
								<span
									className={`inline-block rounded px-2 py-1 text-xs ${
										log.status === "sent"
											? "bg-green-100 text-green-800"
											: log.status === "failed"
												? "bg-red-100 text-red-800"
												: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{log.status}
								</span>
								<p className="mt-1 text-muted-foreground text-xs">
									{log.createdAt
										? new Date(log.createdAt).toLocaleString()
										: ""}
								</p>
							</div>
						</div>
					))}
					{!logsData?.length && (
						<p className="text-muted-foreground">Nenhum log encontrado</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
