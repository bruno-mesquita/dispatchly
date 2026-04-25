"use client";

import { useState } from "react";

import type { LogType } from "./use-notification-logs";
import type { Template } from "./use-templates";

export type SendPayload = {
	type: LogType;
	to: string;
	content: string;
	subject?: string;
	templateId?: string;
	variables?: Record<string, string>;
};

const MOCK_TEMPLATES: Template[] = [
	{
		id: "tpl_1",
		name: "Boas-vindas",
		type: "email",
		subject: "Bem-vindo(a) ao {{empresa}}!",
		content: "Olá {{nome}}, seja bem-vindo(a)! Acesse: {{link}}",
		variables: ["empresa", "nome", "link"],
		isActive: true,
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: "tpl_2",
		name: "Fatura disponível",
		type: "email",
		subject: "Sua fatura #{{faturaId}} está pronta",
		content: "Valor: R$ {{valor}}. Vencimento: {{vencimento}}.",
		variables: ["faturaId", "valor", "vencimento", "linkFatura"],
		isActive: true,
		createdAt: "2024-01-20T10:00:00Z",
	},
	{
		id: "tpl_3",
		name: "Código SMS",
		type: "sms",
		content: "Seu código é {{codigo}}. Válido por {{minutos}} minutos.",
		variables: ["codigo", "minutos"],
		isActive: true,
		createdAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "tpl_4",
		name: "Nova mensagem push",
		type: "push",
		content: "{{remetente}} enviou: {{preview}}",
		variables: ["remetente", "preview"],
		isActive: true,
		createdAt: "2024-02-15T10:00:00Z",
	},
];

export function useSendNotification() {
	const [isSending, setIsSending] = useState(false);

	// TODO: replace with trpc.notifications.send.useMutation()
	async function send(
		_payload: SendPayload,
	): Promise<{ success: boolean; messageId: string }> {
		setIsSending(true);
		await new Promise((r) => setTimeout(r, 800));
		setIsSending(false);
		return { success: true, messageId: `msg_${Date.now()}` };
	}

	return {
		send,
		templates: MOCK_TEMPLATES,
		isSending,
		isLoading: false as const,
		error: null,
	};
}
