"use client";

import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { Input } from "@dispatchly/ui/components/input";
import { Label } from "@dispatchly/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";
import { useState } from "react";
import { toast } from "sonner";

import { useOrgSettings } from "@/hooks/use-org-settings";

export default function SettingsPage() {
	const { settings, update, isSaving } = useOrgSettings();
	const [showSecret, setShowSecret] = useState(false);

	const [orgForm, setOrgForm] = useState({
		name: settings.name,
		slug: settings.slug,
	});

	const [providerForm, setProviderForm] = useState({
		emailProvider: settings.emailProvider,
		smsProvider: settings.smsProvider,
		timezone: settings.timezone,
	});

	const [webhookForm, setWebhookForm] = useState({
		webhookUrl: settings.webhookUrl,
		webhookSecret: settings.webhookSecret,
	});

	async function saveOrg(e: React.FormEvent) {
		e.preventDefault();
		await update(orgForm);
		toast.success("Informações salvas!");
	}

	async function saveProviders(e: React.FormEvent) {
		e.preventDefault();
		await update(providerForm);
		toast.success("Provedores salvos!");
	}

	async function saveWebhook(e: React.FormEvent) {
		e.preventDefault();
		await update(webhookForm);
		toast.success("Webhook salvo!");
	}

	return (
		<div className="space-y-6 p-8">
			<h1 className="font-semibold text-2xl">Configurações</h1>

			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle className="text-base">
						Informações da Organização
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={saveOrg} className="space-y-4">
						<div className="space-y-1.5">
							<Label>Nome</Label>
							<Input
								value={orgForm.name}
								onChange={(e) =>
									setOrgForm((f) => ({ ...f, name: e.target.value }))
								}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Slug</Label>
							<Input
								value={orgForm.slug}
								onChange={(e) =>
									setOrgForm((f) => ({ ...f, slug: e.target.value }))
								}
							/>
						</div>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Salvando…" : "Salvar"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle className="text-base">Provedores</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={saveProviders} className="space-y-4">
						<div className="space-y-1.5">
							<Label>Provedor de Email</Label>
							<Select
								value={providerForm.emailProvider}
								onValueChange={(v) =>
									v &&
									setProviderForm((f) => ({ ...f, emailProvider: v as any }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="resend">Resend</SelectItem>
									<SelectItem value="aws_ses">AWS SES</SelectItem>
									<SelectItem value="sendgrid">SendGrid</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1.5">
							<Label>Provedor de SMS</Label>
							<Select
								value={providerForm.smsProvider}
								onValueChange={(v) =>
									v && setProviderForm((f) => ({ ...f, smsProvider: v as any }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="twilio">Twilio</SelectItem>
									<SelectItem value="vonage">Vonage</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1.5">
							<Label>Fuso Horário</Label>
							<Select
								value={providerForm.timezone}
								onValueChange={(v) =>
									v && setProviderForm((f) => ({ ...f, timezone: v }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="America/Sao_Paulo">
										America/Sao_Paulo
									</SelectItem>
									<SelectItem value="America/Manaus">America/Manaus</SelectItem>
									<SelectItem value="America/Belem">America/Belem</SelectItem>
									<SelectItem value="UTC">UTC</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Salvando…" : "Salvar"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle className="text-base">Webhook Global</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={saveWebhook} className="space-y-4">
						<div className="space-y-1.5">
							<Label>URL</Label>
							<Input
								type="url"
								value={webhookForm.webhookUrl}
								onChange={(e) =>
									setWebhookForm((f) => ({ ...f, webhookUrl: e.target.value }))
								}
								placeholder="https://…"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Secret</Label>
							<div className="flex gap-2">
								<Input
									type={showSecret ? "text" : "password"}
									value={webhookForm.webhookSecret}
									onChange={(e) =>
										setWebhookForm((f) => ({
											...f,
											webhookSecret: e.target.value,
										}))
									}
									className="flex-1 font-mono"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setShowSecret((v) => !v)}
								>
									{showSecret ? "Ocultar" : "Mostrar"}
								</Button>
							</div>
						</div>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Salvando…" : "Salvar"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
