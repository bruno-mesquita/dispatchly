"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

import { SendNotification } from "./components/send-notification";
import { BatchNotifications } from "./components/batch-notifications";
import { TemplateManager } from "./components/template-manager";
import { NotificationLogs } from "./components/notification-logs";
import { BillingPanel } from "./components/billing-panel";

type Tab = "send" | "batch" | "templates" | "logs" | "billing";

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const [activeTab, setActiveTab] = useState<Tab>("send");
	const stats = useQuery(trpc.notifications.stats.queryOptions());

	const tabs: { id: Tab; label: string }[] = [
		{ id: "send", label: "Enviar" },
		{ id: "batch", label: "Lote" },
		{ id: "templates", label: "Templates" },
		{ id: "logs", label: "Logs" },
		{ id: "billing", label: "Plano" },
	];

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Bem-vindo, {session.user.name}
					</p>
				</div>
				<div className="flex gap-4">
					{stats.data?.map((s: any) => (
						<div key={s._id} className="text-center p-3 border rounded">
							<p className="text-2xl font-bold">{s.total}</p>
							<p className="text-xs text-muted-foreground">{s._id}</p>
						</div>
					))}
				</div>
			</div>

			<div className="flex gap-2 mb-6 border-b">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-2 -mb-px border-b-2 ${
							activeTab === tab.id
								? "border-primary font-medium"
								: "border-transparent text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="mt-6">
				{activeTab === "send" && <SendNotification />}
				{activeTab === "batch" && <BatchNotifications />}
				{activeTab === "templates" && <TemplateManager />}
				{activeTab === "logs" && <NotificationLogs />}
				{activeTab === "billing" && <BillingPanel />}
			</div>
		</div>
	);
}
