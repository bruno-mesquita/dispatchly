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
import { Label } from "@dispatchly/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";

import type { WebhookEvent } from "@/hooks/use-webhooks";
import { useWebhooks } from "@/hooks/use-webhooks";

const ALL_EVENTS: WebhookEvent[] = [
	"notification.sent",
	"notification.delivered",
	"notification.failed",
	"notification.bounced",
];

type FormState = {
	name: string;
	url: string;
	secret: string;
	events: WebhookEvent[];
};

const EMPTY_FORM: FormState = {
	name: "",
	url: "",
	secret: "",
	events: ["notification.delivered", "notification.failed"],
};

export default function WebhooksPage() {
	const { webhooks, create, toggle, remove } = useWebhooks();
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState<FormState>(EMPTY_FORM);

	function toggleEvent(event: WebhookEvent) {
		setForm((f) => ({
			...f,
			events: f.events.includes(event)
				? f.events.filter((e) => e !== event)
				: [...f.events, event],
		}));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.name || !form.url || form.events.length === 0) {
			toast.error("Preencha nome, URL e selecione ao menos um evento");
			return;
		}
		create({
			name: form.name,
			url: form.url,
			secret: form.secret || `whsec_${Math.random().toString(36).slice(2)}`,
			events: form.events,
			isActive: true,
		});
		toast.success("Webhook criado!");
		setForm(EMPTY_FORM);
		setShowForm(false);
	}

	return (
		<div className="p-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-semibold text-2xl">Webhooks</h1>
				<Button onClick={() => setShowForm((v) => !v)}>
					{showForm ? "Cancelar" : "+ Novo Webhook"}
				</Button>
			</div>

			{showForm && (
				<Card className="mb-6 max-w-lg">
					<CardHeader>
						<CardTitle className="text-base">Novo Webhook</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<Label>Nome</Label>
								<Input
									value={form.name}
									onChange={(e) =>
										setForm((f) => ({ ...f, name: e.target.value }))
									}
									placeholder="Ex: Status de entrega"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>URL</Label>
								<Input
									type="url"
									value={form.url}
									onChange={(e) =>
										setForm((f) => ({ ...f, url: e.target.value }))
									}
									placeholder="https://…"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>Secret (opcional)</Label>
								<Input
									value={form.secret}
									onChange={(e) =>
										setForm((f) => ({ ...f, secret: e.target.value }))
									}
									placeholder="Gerado automaticamente se vazio"
									className="font-mono"
								/>
							</div>
							<div className="space-y-2">
								<Label>Eventos</Label>
								<div className="space-y-2">
									{ALL_EVENTS.map((event) => (
										<label
											key={event}
											className="flex cursor-pointer items-center gap-2 text-sm"
										>
											<input
												type="checkbox"
												checked={form.events.includes(event)}
												onChange={() => toggleEvent(event)}
												className="rounded"
											/>
											<span className="font-mono">{event}</span>
										</label>
									))}
								</div>
							</div>
							<Button type="submit" className="w-full">
								Criar Webhook
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="space-y-4">
				{webhooks.map((wh) => (
					<Card key={wh.id}>
						<CardContent className="pt-4">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<p className="font-medium">{wh.name}</p>
										<Badge variant={wh.isActive ? "default" : "secondary"}>
											{wh.isActive ? "Ativo" : "Inativo"}
										</Badge>
									</div>
									<p className="font-mono text-muted-foreground text-sm">
										{wh.url}
									</p>
									<div className="flex flex-wrap gap-1">
										{wh.events.map((ev) => (
											<Badge key={ev} variant="outline" className="text-xs">
												{ev}
											</Badge>
										))}
									</div>
									{wh.lastTriggeredAt && (
										<p className="text-muted-foreground text-xs">
											Último disparo:{" "}
											{new Date(wh.lastTriggeredAt).toLocaleString("pt-BR")}
										</p>
									)}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => toggle(wh.id)}
									>
										{wh.isActive ? "Desativar" : "Ativar"}
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => {
											remove(wh.id);
											toast.success("Webhook removido");
										}}
									>
										Excluir
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
				{webhooks.length === 0 && (
					<p className="text-center text-muted-foreground">
						Nenhum webhook configurado ainda.
					</p>
				)}
			</div>
		</div>
	);
}
