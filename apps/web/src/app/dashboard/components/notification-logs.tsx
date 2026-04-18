"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dispatchly/ui/components/card";

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
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {log.type?.toUpperCase()} → {log.to}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {log.subject || log.content}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    log.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : log.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {log.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
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
