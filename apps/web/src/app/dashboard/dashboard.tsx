"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { BatchNotifications } from "./components/batch-notifications";
import { BillingPanel } from "./components/billing-panel";
import { NotificationLogs } from "./components/notification-logs";
import { SendNotification } from "./components/send-notification";
import { SettingsPanel } from "./components/settings-panel";
import { TemplateManager } from "./components/template-manager";

type Tab = "send" | "batch" | "templates" | "logs" | "billing" | "settings";

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
		{ id: "settings", label: "Configurações" },
	];

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Dashboard</h1>
					<p className="text-muted-foreground">
						Bem-vindo, {session.user.name}
					</p>
				</div>
				<div className="flex gap-4">
					{stats.data?.map((s: any) => (
						<div key={s._id} className="rounded border p-3 text-center">
							<p className="font-bold text-2xl">{s.total}</p>
							<p className="text-muted-foreground text-xs">{s._id}</p>
						</div>
					))}
				</div>
			</div>

			<div className="mb-6 flex gap-2 border-b">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={`-mb-px border-b-2 px-4 py-2 ${
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
				{activeTab === "settings" && <SettingsPanel />}
			</div>
		</div>
	);
}
