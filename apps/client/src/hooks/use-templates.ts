"use client";

import { useState } from "react";

import type { LogType } from "./use-notification-logs";

export type Template = {
	id: string;
	name: string;
	type: LogType;
	subject?: string;
	content: string;
	variables: string[];
	isActive: boolean;
	createdAt: string;
};

const INITIAL_TEMPLATES: Template[] = [
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
		content:
			"Valor: R$ {{valor}}. Vencimento: {{vencimento}}. Acesse: {{linkFatura}}",
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
	{
		id: "tpl_5",
		name: "Lembrete de pagamento",
		type: "sms",
		content:
			"Olá {{nome}}, seu pagamento de R$ {{valor}} vence em {{dias}} dias.",
		variables: ["nome", "valor", "dias"],
		isActive: false,
		createdAt: "2024-03-01T10:00:00Z",
	},
];

let nextId = 6;

export function useTemplates() {
	const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);

	// TODO: replace with trpc.templates.list/create/update/delete

	function create(data: Omit<Template, "id" | "createdAt">) {
		const tpl: Template = {
			...data,
			id: `tpl_${nextId++}`,
			createdAt: new Date().toISOString(),
		};
		setTemplates((prev) => [tpl, ...prev]);
		return tpl;
	}

	function update(
		id: string,
		data: Partial<Omit<Template, "id" | "createdAt">>,
	) {
		setTemplates((prev) =>
			prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
		);
	}

	function remove(id: string) {
		setTemplates((prev) => prev.filter((t) => t.id !== id));
	}

	return {
		templates,
		create,
		update,
		remove,
		isLoading: false as const,
		error: null,
	};
}
