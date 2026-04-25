"use client";

import { useState } from "react";

import type { LogType } from "./use-notification-logs";
import type { Template } from "./use-templates";

export type BatchPayload = {
	type: LogType;
	recipients: Array<{ to: string; variables?: Record<string, string> }>;
	content: string;
	subject?: string;
	templateId?: string;
};

export type BatchResult = {
	total: number;
	sent: number;
	failed: number;
};

const MOCK_TEMPLATES: Template[] = [
	{
		id: "tpl_1",
		name: "Boas-vindas",
		type: "email",
		subject: "Bem-vindo(a) ao {{empresa}}!",
		content: "Olá {{nome}}, seja bem-vindo(a)!",
		variables: ["empresa", "nome", "link"],
		isActive: true,
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: "tpl_2",
		name: "Fatura disponível",
		type: "email",
		subject: "Sua fatura está pronta",
		content: "Valor: R$ {{valor}}.",
		variables: ["faturaId", "valor", "vencimento"],
		isActive: true,
		createdAt: "2024-01-20T10:00:00Z",
	},
	{
		id: "tpl_3",
		name: "Código SMS",
		type: "sms",
		content: "Seu código é {{codigo}}.",
		variables: ["codigo", "minutos"],
		isActive: true,
		createdAt: "2024-02-01T10:00:00Z",
	},
];

export function useBatchNotifications() {
	const [isSending, setIsSending] = useState(false);
	const [lastResult, setLastResult] = useState<BatchResult | null>(null);

	// TODO: replace with trpc.notifications.sendBatch.useMutation()
	async function sendBatch(payload: BatchPayload): Promise<BatchResult> {
		setIsSending(true);
		await new Promise((r) => setTimeout(r, 1200));
		const failed = Math.floor(payload.recipients.length * 0.03);
		const result: BatchResult = {
			total: payload.recipients.length,
			sent: payload.recipients.length - failed,
			failed,
		};
		setLastResult(result);
		setIsSending(false);
		return result;
	}

	return {
		sendBatch,
		templates: MOCK_TEMPLATES,
		isSending,
		lastResult,
		isLoading: false as const,
		error: null,
	};
}
