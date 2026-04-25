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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";
import { useState } from "react";
import { toast } from "sonner";

import type { LogType } from "@/hooks/use-notification-logs";
import { useSendNotification } from "@/hooks/use-send-notification";

export default function SendNotificationPage() {
	const { send, templates, isSending } = useSendNotification();

	const [type, setType] = useState<LogType>("email");
	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [content, setContent] = useState("");
	const [templateId, setTemplateId] = useState<string>("");

	const availableTemplates = templates.filter((t) => t.type === type);
	const selectedTemplate = templates.find((t) => t.id === templateId);

	function handleTemplateSelect(id: string) {
		setTemplateId(id);
		const tpl = templates.find((t) => t.id === id);
		if (tpl) {
			setContent(tpl.content);
			if (tpl.subject) setSubject(tpl.subject);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!to || !content) {
			toast.error("Preencha destinatário e conteúdo");
			return;
		}
		const result = await send({
			type,
			to,
			content,
			subject: subject || undefined,
			templateId: templateId || undefined,
		});
		if (result.success) {
			toast.success(`Notificação enviada! ID: ${result.messageId}`);
			setTo("");
			setSubject("");
			setContent("");
			setTemplateId("");
		}
	}

	return (
		<div className="p-8">
			<h1 className="mb-6 font-semibold text-2xl">Enviar Notificação</h1>
			<Card className="max-w-xl">
				<CardHeader>
					<CardTitle className="text-base">Nova Notificação</CardTitle>
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
									setContent("");
									setSubject("");
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

						<div className="space-y-1.5">
							<Label>Destinatário</Label>
							<Input
								placeholder={
									type === "email"
										? "usuario@exemplo.com"
										: type === "sms"
											? "+5511999990000"
											: "ExponentPushToken[...]"
								}
								value={to}
								onChange={(e) => setTo(e.target.value)}
							/>
						</div>

						{availableTemplates.length > 0 && (
							<div className="space-y-1.5">
								<Label>Template (opcional)</Label>
								<Select
									value={templateId || "none"}
									onValueChange={(v) =>
										!v || v === "none"
											? setTemplateId("")
											: handleTemplateSelect(v)
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
								{selectedTemplate && selectedTemplate.variables.length > 0 && (
									<p className="text-muted-foreground text-xs">
										Variáveis:{" "}
										{selectedTemplate.variables.map((v) => (
											<Badge key={v} variant="outline" className="mr-1 text-xs">
												{`{{${v}}}`}
											</Badge>
										))}
									</p>
								)}
							</div>
						)}

						{type === "email" && (
							<div className="space-y-1.5">
								<Label>Assunto</Label>
								<Input
									placeholder="Assunto do email"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
								/>
							</div>
						)}

						<div className="space-y-1.5">
							<Label>Conteúdo</Label>
							<textarea
								className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								placeholder="Conteúdo da notificação…"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
						</div>

						<Button type="submit" disabled={isSending} className="w-full">
							{isSending ? "Enviando…" : "Enviar"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
