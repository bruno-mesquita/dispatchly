"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
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
import { useBatchNotifications } from "@/hooks/use-batch-notifications";
import type { LogType } from "@/hooks/use-notification-logs";

type InputMode = "json" | "csv";

const EXAMPLE_JSON = `[
  { "to": "alice@example.com" },
  { "to": "bob@example.com" },
  { "to": "carol@example.com" }
]`;

export default function BatchPage() {
	const { sendBatch, templates, isSending, lastResult } =
		useBatchNotifications();

	const [mode, setMode] = useState<InputMode>("json");
	const [type, setType] = useState<LogType>("email");
	const [content, setContent] = useState("");
	const [subject, setSubject] = useState("");
	const [templateId, setTemplateId] = useState("");
	const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
	const [csvFile, setCsvFile] = useState<File | null>(null);

	const availableTemplates = templates.filter((t) => t.type === type);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		let recipients: Array<{ to: string }> = [];

		if (mode === "json") {
			try {
				recipients = JSON.parse(jsonInput);
				if (!Array.isArray(recipients)) throw new Error();
			} catch {
				toast.error("JSON inválido. Esperado array de objetos com campo 'to'.");
				return;
			}
		} else {
			if (!csvFile) {
				toast.error("Selecione um arquivo CSV");
				return;
			}
			const text = await csvFile.text();
			const lines = text.split("\n").filter(Boolean);
			recipients = lines
				.slice(1)
				.map((line) => ({ to: line.split(",")[0]?.trim() ?? "" }))
				.filter((r) => r.to);
		}

		if (recipients.length === 0) {
			toast.error("Nenhum destinatário encontrado");
			return;
		}

		if (!content && !templateId) {
			toast.error("Informe o conteúdo ou selecione um template");
			return;
		}

		const result = await sendBatch({
			type,
			recipients,
			content: content || "{{content}}",
			subject: subject || undefined,
			templateId: templateId || undefined,
		});

		toast.success(
			`Lote concluído: ${result.sent} enviados, ${result.failed} falhas`,
		);
	}

	return (
		<div className="p-8">
			<h1 className="mb-6 font-semibold text-2xl">Envio em Lote</h1>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Configuração</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<Label>Tipo</Label>
								<Select
									value={type}
									onValueChange={(v) => {
										setType(v as LogType);
										setTemplateId("");
									}}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="email">Email</SelectItem>
										<SelectItem value="sms">SMS</SelectItem>
										<SelectItem value="push">Push</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{availableTemplates.length > 0 && (
								<div className="space-y-1.5">
									<Label>Template (opcional)</Label>
									<Select
										value={templateId || "none"}
										onValueChange={(v) =>
											setTemplateId(!v || v === "none" ? "" : v)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sem template" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">Sem template</SelectItem>
											{availableTemplates.map((t) => (
												<SelectItem key={t.id} value={t.id}>
													{t.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							{type === "email" && (
								<div className="space-y-1.5">
									<Label>Assunto</Label>
									<input
										className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										placeholder="Assunto do email"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<Label>Conteúdo</Label>
								<textarea
									className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									placeholder="Conteúdo. Use {{variavel}} para interpolação."
									value={content}
									onChange={(e) => setContent(e.target.value)}
								/>
							</div>

							<div className="space-y-1.5">
								<Label>Destinatários</Label>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => setMode("json")}
										className={`rounded-md px-3 py-1.5 text-sm transition-colors ${mode === "json" ? "bg-primary text-primary-foreground" : "border hover:bg-accent"}`}
									>
										JSON
									</button>
									<button
										type="button"
										onClick={() => setMode("csv")}
										className={`rounded-md px-3 py-1.5 text-sm transition-colors ${mode === "csv" ? "bg-primary text-primary-foreground" : "border hover:bg-accent"}`}
									>
										CSV
									</button>
								</div>

								{mode === "json" ? (
									<textarea
										className="min-h-32 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										value={jsonInput}
										onChange={(e) => setJsonInput(e.target.value)}
									/>
								) : (
									<div className="space-y-1">
										<input
											type="file"
											accept=".csv"
											onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
											className="w-full text-sm"
										/>
										<p className="text-muted-foreground text-xs">
											CSV com coluna "to" na primeira linha
										</p>
									</div>
								)}
							</div>

							<Button type="submit" disabled={isSending} className="w-full">
								{isSending ? "Enviando…" : "Enviar Lote"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{lastResult && (
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Resultado</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-3 gap-4 text-center">
								<div className="rounded-lg border p-4">
									<p className="font-bold text-2xl">{lastResult.total}</p>
									<p className="text-muted-foreground text-sm">Total</p>
								</div>
								<div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
									<p className="font-bold text-2xl text-green-700 dark:text-green-400">
										{lastResult.sent}
									</p>
									<p className="text-green-600 text-sm dark:text-green-500">
										Enviados
									</p>
								</div>
								<div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
									<p className="font-bold text-2xl text-red-700 dark:text-red-400">
										{lastResult.failed}
									</p>
									<p className="text-red-600 text-sm dark:text-red-500">
										Falhas
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="default">
									{Math.round((lastResult.sent / lastResult.total) * 100)}% taxa
									de sucesso
								</Badge>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
