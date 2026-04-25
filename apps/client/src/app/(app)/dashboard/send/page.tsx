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
import { Kicker } from "@/components/kicker";

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
		<div className="space-y-8 p-6 lg:p-10">
			<header>
				<Kicker num="02" label="Dispatches" />
				<h1 className="font-medium font-sans text-3xl tracking-tight">
					New Dispatch —{" "}
					<span className="text-muted-foreground">single message.</span>
				</h1>
			</header>

			<Card className="max-w-2xl border-hairline bg-muted/5 shadow-none">
				<CardHeader className="border-b px-6 py-4">
					<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
						Dispatch Configuration
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Channel Type
								</Label>
								<Select
									value={type}
									onValueChange={(v) => {
										setType(v as LogType);
										setTemplateId("");
										setContent("");
										setSubject("");
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

							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Recipient
								</Label>
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
									className="bg-background font-mono text-[12px]"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="font-mono text-[10px] uppercase opacity-60">
								Template (Optional)
							</Label>
							<Select
								value={templateId || "none"}
								onValueChange={(v) =>
									!v || v === "none"
										? setTemplateId("")
										: handleTemplateSelect(v)
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
							{selectedTemplate && selectedTemplate.variables.length > 0 && (
								<p className="mt-2 flex flex-wrap gap-1">
									<span className="mr-1 self-center font-mono text-[9px] uppercase opacity-40">
										Variables:
									</span>
									{selectedTemplate.variables.map((v) => (
										<Badge
											key={v}
											variant="outline"
											className="h-4 px-1 font-mono text-[9px] opacity-70"
										>
											{`{{${v}}}`}
										</Badge>
									))}
								</p>
							)}
						</div>

						{type === "email" && (
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Subject
								</Label>
								<Input
									placeholder="Assunto do email"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									className="bg-background font-mono text-[12px]"
								/>
							</div>
						)}

						<div className="space-y-1.5">
							<Label className="font-mono text-[10px] uppercase opacity-60">
								Content
							</Label>
							<textarea
								className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								placeholder="Conteúdo da notificação…"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
						</div>

						<Button
							type="submit"
							disabled={isSending}
							className="w-full font-mono text-[12px] uppercase tracking-wider"
						>
							{isSending ? "Dispatching…" : "Execute Dispatch →"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
