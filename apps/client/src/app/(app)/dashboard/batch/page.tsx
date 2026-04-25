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
import { Kicker } from "@/components/kicker";
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
		<div className="space-y-8 p-6 lg:p-10">
			<header>
				<Kicker num="03" label="Batch Operations" />
				<h1 className="font-medium font-sans text-3xl tracking-tight">
					Bulk Ingest —{" "}
					<span className="text-muted-foreground">CSV / JSON payloads.</span>
				</h1>
			</header>

			<div className="grid gap-8 lg:grid-cols-2">
				<Card className="border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Execution Plan
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Channel Type
								</Label>
								<Select
									value={type}
									onValueChange={(v) => {
										setType(v as LogType);
										setTemplateId("");
									}}
								>
									<SelectTrigger className="bg-background font-mono text-[12px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="font-mono text-[12px]">
										<SelectItem value="email">Email</SelectItem>
										<SelectItem value="sms">SMS</SelectItem>
										<SelectItem value="push">Push</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{availableTemplates.length > 0 && (
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Template (Optional)
									</Label>
									<Select
										value={templateId || "none"}
										onValueChange={(v) =>
											setTemplateId(!v || v === "none" ? "" : v)
										}
									>
										<SelectTrigger className="bg-background font-mono text-[12px]">
											<SelectValue placeholder="Sem template" />
										</SelectTrigger>
										<SelectContent className="font-mono text-[12px]">
											<SelectItem value="none">No template</SelectItem>
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
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Global Subject
									</Label>
									<input
										className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										placeholder="Email subject"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Fallback Content
								</Label>
								<textarea
									className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									placeholder="Use {{variable}} for interpolation"
									value={content}
									onChange={(e) => setContent(e.target.value)}
								/>
							</div>

							<div className="space-y-3">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Ingest Source
								</Label>
								<div className="flex w-fit gap-1 rounded-md border bg-muted/20 p-1">
									<button
										type="button"
										onClick={() => setMode("json")}
										className={`rounded-sm px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${mode === "json" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
									>
										JSON
									</button>
									<button
										type="button"
										onClick={() => setMode("csv")}
										className={`rounded-sm px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${mode === "csv" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
									>
										CSV
									</button>
								</div>

								{mode === "json" ? (
									<textarea
										className="min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-[12px] text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										value={jsonInput}
										onChange={(e) => setJsonInput(e.target.value)}
									/>
								) : (
									<div className="space-y-3 rounded-md border border-hairline border-dashed bg-muted/10 p-8 text-center">
										<input
											type="file"
											accept=".csv"
											id="csv-upload"
											onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
											className="sr-only"
										/>
										<label
											htmlFor="csv-upload"
											className="group cursor-pointer"
										>
											<div className="mb-2 font-mono text-[11px] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
												{csvFile ? csvFile.name : "Select CSV source file"}
											</div>
											<div className="text-[10px] text-muted-foreground opacity-40">
												CSV must contain "to" column in first row
											</div>
										</label>
									</div>
								)}
							</div>

							<Button
								type="submit"
								disabled={isSending}
								className="w-full font-mono text-[12px] uppercase tracking-wider"
							>
								{isSending ? "Processing Batch…" : "Execute Batch Send →"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{lastResult && (
					<div className="space-y-6">
						<Kicker num="RES" label="Last Result" />
						<Card className="border-hairline bg-muted/5 shadow-none">
							<CardContent className="space-y-8 p-8">
								<div className="grid grid-cols-3 gap-8">
									<div className="space-y-1">
										<p className="font-mono text-[10px] text-muted-foreground uppercase opacity-60">
											Total
										</p>
										<p className="font-medium font-sans text-4xl">
											{lastResult.total}
										</p>
									</div>
									<div className="space-y-1">
										<p className="font-mono text-[10px] text-green-500/80 uppercase opacity-60">
											Sent
										</p>
										<p className="font-medium font-sans text-4xl text-green-500">
											{lastResult.sent}
										</p>
									</div>
									<div className="space-y-1">
										<p className="font-mono text-[10px] text-red-500/80 uppercase opacity-60">
											Failed
										</p>
										<p className="font-medium font-sans text-4xl text-red-500">
											{lastResult.failed}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between font-mono text-[10px] uppercase opacity-60">
										<span>Completion Rate</span>
										<span>
											{Math.round((lastResult.sent / lastResult.total) * 100)}%
										</span>
									</div>
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
										<div
											className="h-full bg-primary transition-all duration-1000"
											style={{
												width: `${(lastResult.sent / lastResult.total) * 100}%`,
											}}
										/>
									</div>
								</div>

								<div className="border-hairline border-t pt-4">
									<Button
										variant="outline"
										className="w-full font-mono text-[11px] uppercase tracking-wider opacity-60"
										onClick={() => window.location.reload()}
									>
										Dismiss Result
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
