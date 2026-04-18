"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { Button } from "@dispatchly/ui/components/button";
import { Input } from "@dispatchly/ui/components/input";
import { Label } from "@dispatchly/ui/components/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";

export function BatchNotifications() {
	const [type, setType] = useState<"email" | "sms" | "push">("email");
	const [recipients, setRecipients] = useState("");
	const [subject, setSubject] = useState("");
	const [content, setContent] = useState("");
	const [templateId, setTemplateId] = useState("");
	const [sentCount, setSentCount] = useState(0);
	const [failedCount, setFailedCount] = useState(0);

	const sendMutation = useMutation(
		trpc.notifications.send.mutationOptions() as any,
	);
	const templates = useQuery(trpc.templates.list.queryOptions({ type }) as any);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const recipientList = recipients
			.split(/[\n,]/)
			.map((r) => r.trim())
			.filter(Boolean);

		setSentCount(0);
		setFailedCount(0);

		const results = await Promise.allSettled(
			recipientList.map((to) =>
				(sendMutation as any).mutateAsync({
					type,
					to,
					subject: type === "email" ? subject : undefined,
					content,
					templateId: templateId || undefined,
				}),
			),
		);

		const succeeded = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;
		setSentCount(succeeded);
		setFailedCount(failed);

		if (failed > 0) {
			toast.warning(`${succeeded} enviadas, ${failed} falharam`);
		} else {
			toast.success(`${succeeded} notificações enviadas!`);
		}

		setRecipients("");
		setSubject("");
		setContent("");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Enviar Múltiplas Notificações</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label>Tipo</Label>
						<Select
							value={type}
							onValueChange={(v: string | null) =>
								v && setType(v as typeof type)
							}
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

					<div className="space-y-2">
						<Label>Destinatários (um por linha)</Label>
						<textarea
							className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							value={recipients}
							onChange={(e) => setRecipients(e.target.value)}
							placeholder={
								type === "email"
									? "email1@example.com\nemail2@example.com"
									: "+5511999999999\n+5511888888888"
							}
							required
						/>
					</div>

					{type === "email" && (
						<div className="space-y-2">
							<Label>Assunto</Label>
							<Input
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								placeholder="Assunto do email"
								required
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label>Template (opcional)</Label>
						<Select
							value={templateId}
							onValueChange={(v: string | null) => v && setTemplateId(v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecione um template" />
							</SelectTrigger>
							<SelectContent>
								{(templates.data as any)?.map((t: any) => (
									<SelectItem key={t._id?.toString()} value={t._id?.toString()}>
										{t.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Conteúdo</Label>
						<textarea
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Digite a mensagem..."
							required
						/>
					</div>

					<Button type="submit" disabled={sendMutation.isPending}>
						{sendMutation.isPending ? "Enviando..." : "Enviar Todos"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
