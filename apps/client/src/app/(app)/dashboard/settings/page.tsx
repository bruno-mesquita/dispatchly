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
import { Kicker } from "@/components/kicker";

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
		<div className="space-y-12 p-6 lg:p-10">
			<header>
				<Kicker num="08" label="System Settings" />
				<h1 className="font-medium font-sans text-3xl tracking-tight">
					Configuration —{" "}
					<span className="text-muted-foreground">organization & keys.</span>
				</h1>
			</header>

			<div className="grid max-w-4xl gap-8">
				<Card className="border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Organization Profile
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={saveOrg} className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Display Name
									</Label>
									<Input
										value={orgForm.name}
										onChange={(e) =>
											setOrgForm((f) => ({ ...f, name: e.target.value }))
										}
										className="bg-background font-mono text-[12px]"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Namespace Slug
									</Label>
									<Input
										value={orgForm.slug}
										onChange={(e) =>
											setOrgForm((f) => ({ ...f, slug: e.target.value }))
										}
										className="bg-background font-mono text-[12px]"
									/>
								</div>
							</div>
							<Button
								type="submit"
								disabled={isSaving}
								className="font-mono text-[11px] uppercase tracking-wider"
							>
								{isSaving ? "Saving…" : "Update Profile"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card className="border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Primary Providers
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={saveProviders} className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Email Gateway
									</Label>
									<Select
										value={providerForm.emailProvider}
										onValueChange={(v) =>
											v &&
											setProviderForm((f) => ({
												...f,
												emailProvider: v as any,
											}))
										}
									>
										<SelectTrigger className="bg-background font-mono text-[12px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="font-mono text-[12px]">
											<SelectItem value="resend">Resend</SelectItem>
											<SelectItem value="aws_ses">AWS SES</SelectItem>
											<SelectItem value="sendgrid">SendGrid</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										SMS Gateway
									</Label>
									<Select
										value={providerForm.smsProvider}
										onValueChange={(v) =>
											v &&
											setProviderForm((f) => ({ ...f, smsProvider: v as any }))
										}
									>
										<SelectTrigger className="bg-background font-mono text-[12px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="font-mono text-[12px]">
											<SelectItem value="twilio">Twilio</SelectItem>
											<SelectItem value="vonage">Vonage</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Default Timezone
									</Label>
									<Select
										value={providerForm.timezone}
										onValueChange={(v) =>
											v && setProviderForm((f) => ({ ...f, timezone: v }))
										}
									>
										<SelectTrigger className="bg-background font-mono text-[12px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="font-mono text-[12px]">
											<SelectItem value="America/Sao_Paulo">
												America/Sao_Paulo
											</SelectItem>
											<SelectItem value="America/Manaus">
												America/Manaus
											</SelectItem>
											<SelectItem value="America/Belem">
												America/Belem
											</SelectItem>
											<SelectItem value="UTC">UTC</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<Button
								type="submit"
								disabled={isSaving}
								className="font-mono text-[11px] uppercase tracking-wider"
							>
								{isSaving ? "Saving…" : "Update Gateways"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card className="border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Global Webhook Trace
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={saveWebhook} className="space-y-6">
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Ingest URL
								</Label>
								<Input
									type="url"
									value={webhookForm.webhookUrl}
									onChange={(e) =>
										setWebhookForm((f) => ({
											...f,
											webhookUrl: e.target.value,
										}))
									}
									placeholder="https://…"
									className="bg-background font-mono text-[12px]"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Secret Key
								</Label>
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
										className="flex-1 bg-background font-mono text-[12px]"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setShowSecret((v) => !v)}
										className="px-3 font-mono text-[10px] uppercase"
									>
										{showSecret ? "Hide" : "Reveal"}
									</Button>
								</div>
							</div>
							<Button
								type="submit"
								disabled={isSaving}
								className="font-mono text-[11px] uppercase tracking-wider"
							>
								{isSaving ? "Saving…" : "Update Webhook"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
