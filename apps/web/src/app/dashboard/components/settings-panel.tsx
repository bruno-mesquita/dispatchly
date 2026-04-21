"use client";

import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

interface SettingsForm {
	name: string;
	slug: string;
	emailProvider: "resend" | "aws-ses" | "sendgrid";
	smsProvider: string;
	timezone: string;
	webhookUrl: string;
	webhookSecret: string;
}

const DEFAULT_FORM: SettingsForm = {
	name: "",
	slug: "",
	emailProvider: "resend",
	smsProvider: "twilio",
	timezone: "UTC",
	webhookUrl: "",
	webhookSecret: "",
};

export function SettingsPanel() {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);

	const orgQuery = useQuery(trpc.organization.get.queryOptions() as any);

	useEffect(() => {
		const org = orgQuery.data as any;
		if (!org) return;
		setForm({
			name: org.name ?? "",
			slug: org.slug ?? "",
			emailProvider: org.settings?.emailProvider ?? "resend",
			smsProvider: org.settings?.smsProvider ?? "twilio",
			timezone: org.settings?.timezone ?? "UTC",
			webhookUrl: org.settings?.webhookUrl ?? "",
			webhookSecret: org.settings?.webhookSecret ?? "",
		});
	}, [orgQuery.data]);

	const updateMutation = useMutation({
		mutationFn: async (data: SettingsForm) =>
			(trpc.organization.update as any).mutate({
				name: data.name || undefined,
				slug: data.slug || undefined,
				settings: {
					emailProvider: data.emailProvider,
					smsProvider: data.smsProvider || undefined,
					timezone: data.timezone || undefined,
					webhookUrl: data.webhookUrl || undefined,
					webhookSecret: data.webhookSecret || undefined,
				},
			}),
		onSuccess: () => {
			toast.success("Configurações salvas");
			queryClient.invalidateQueries({ queryKey: ["organization", "get"] });
		},
		onError: (error: any) => toast.error(error?.message ?? "Erro ao salvar"),
	});

	const set =
		(field: keyof SettingsForm) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [field]: e.target.value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateMutation.mutate(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Organização</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="font-medium text-sm" htmlFor="org-name">
								Nome
							</label>
							<input
								id="org-name"
								className="w-full rounded border px-3 py-2 text-sm"
								value={form.name}
								onChange={set("name")}
								placeholder="Minha Empresa"
							/>
						</div>
						<div className="space-y-1">
							<label className="font-medium text-sm" htmlFor="org-slug">
								Slug
							</label>
							<input
								id="org-slug"
								className="w-full rounded border px-3 py-2 text-sm"
								value={form.slug}
								onChange={set("slug")}
								placeholder="minha-empresa"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Provedores de Notificação</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="font-medium text-sm" htmlFor="email-provider">
								Provedor de Email
							</label>
							<select
								id="email-provider"
								className="w-full rounded border px-3 py-2 text-sm"
								value={form.emailProvider}
								onChange={set("emailProvider")}
							>
								<option value="resend">Resend</option>
								<option value="aws-ses">AWS SES</option>
								<option value="sendgrid">SendGrid</option>
							</select>
						</div>
						<div className="space-y-1">
							<label className="font-medium text-sm" htmlFor="sms-provider">
								Provedor de SMS
							</label>
							<input
								id="sms-provider"
								className="w-full rounded border px-3 py-2 text-sm"
								value={form.smsProvider}
								onChange={set("smsProvider")}
								placeholder="twilio"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Preferências</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-1">
						<label className="font-medium text-sm" htmlFor="timezone">
							Fuso Horário
						</label>
						<input
							id="timezone"
							className="w-full rounded border px-3 py-2 text-sm"
							value={form.timezone}
							onChange={set("timezone")}
							placeholder="UTC"
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Webhook</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-1">
						<label className="font-medium text-sm" htmlFor="webhook-url">
							URL do Webhook
						</label>
						<input
							id="webhook-url"
							className="w-full rounded border px-3 py-2 text-sm"
							value={form.webhookUrl}
							onChange={set("webhookUrl")}
							placeholder="https://exemplo.com/webhook"
						/>
					</div>
					<div className="space-y-1">
						<label className="font-medium text-sm" htmlFor="webhook-secret">
							Segredo do Webhook
						</label>
						<input
							id="webhook-secret"
							type="password"
							className="w-full rounded border px-3 py-2 text-sm"
							value={form.webhookSecret}
							onChange={set("webhookSecret")}
							placeholder="••••••••"
						/>
					</div>
				</CardContent>
			</Card>

			<Button type="submit" disabled={updateMutation.isPending}>
				{updateMutation.isPending ? "Salvando..." : "Salvar Configurações"}
			</Button>
		</form>
	);
}
