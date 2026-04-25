"use client";

import { useState } from "react";

export type LogType = "email" | "sms" | "push";
export type LogStatus = "pending" | "sent" | "delivered" | "failed" | "bounced";

export type NotificationLog = {
	id: string;
	type: LogType;
	status: LogStatus;
	provider: string;
	to: string;
	subject?: string;
	templateId?: string;
	sentAt?: string;
	createdAt: string;
};

export type LogFilters = {
	type?: LogType;
	status?: LogStatus;
	search?: string;
};

const PAGE_SIZE = 20;

const MOCK: NotificationLog[] = [
	{
		id: "log_1",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "alice@example.com",
		subject: "Bem-vindo!",
		sentAt: "2024-04-23T10:05:00Z",
		createdAt: "2024-04-23T10:04:00Z",
	},
	{
		id: "log_2",
		type: "sms",
		status: "sent",
		provider: "twilio",
		to: "+5511999990001",
		createdAt: "2024-04-23T09:55:00Z",
	},
	{
		id: "log_3",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[abc123]",
		createdAt: "2024-04-23T09:50:00Z",
	},
	{
		id: "log_4",
		type: "email",
		status: "failed",
		provider: "resend",
		to: "invalido@dominio.xyz",
		subject: "Lembrete",
		createdAt: "2024-04-23T09:40:00Z",
	},
	{
		id: "log_5",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "bob@empresa.com",
		subject: "Fatura #1042",
		sentAt: "2024-04-23T09:30:00Z",
		createdAt: "2024-04-23T09:29:00Z",
	},
	{
		id: "log_6",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+5511999990002",
		sentAt: "2024-04-23T09:20:00Z",
		createdAt: "2024-04-23T09:19:00Z",
	},
	{
		id: "log_7",
		type: "email",
		status: "pending",
		provider: "resend",
		to: "carol@startup.io",
		subject: "Confirme seu email",
		createdAt: "2024-04-23T09:10:00Z",
	},
	{
		id: "log_8",
		type: "push",
		status: "bounced",
		provider: "expo",
		to: "ExponentPushToken[def456]",
		createdAt: "2024-04-23T09:00:00Z",
	},
	{
		id: "log_9",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "diana@cliente.com",
		subject: "Pedido enviado",
		sentAt: "2024-04-23T08:50:00Z",
		createdAt: "2024-04-23T08:49:00Z",
	},
	{
		id: "log_10",
		type: "sms",
		status: "sent",
		provider: "twilio",
		to: "+5511999990003",
		createdAt: "2024-04-23T08:40:00Z",
	},
	{
		id: "log_11",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "edu@parceiro.net",
		subject: "Relatório semanal",
		sentAt: "2024-04-23T08:30:00Z",
		createdAt: "2024-04-23T08:29:00Z",
	},
	{
		id: "log_12",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[ghi789]",
		sentAt: "2024-04-23T08:10:00Z",
		createdAt: "2024-04-23T08:09:00Z",
	},
	{
		id: "log_13",
		type: "email",
		status: "failed",
		provider: "resend",
		to: "erro@test.com",
		subject: "Código 2FA",
		createdAt: "2024-04-23T08:00:00Z",
	},
	{
		id: "log_14",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+5511999990004",
		sentAt: "2024-04-23T07:50:00Z",
		createdAt: "2024-04-23T07:49:00Z",
	},
	{
		id: "log_15",
		type: "email",
		status: "bounced",
		provider: "resend",
		to: "antigo@extinto.br",
		subject: "Convite",
		createdAt: "2024-04-23T07:30:00Z",
	},
	{
		id: "log_16",
		type: "push",
		status: "sent",
		provider: "expo",
		to: "ExponentPushToken[jkl012]",
		createdAt: "2024-04-23T07:40:00Z",
	},
	{
		id: "log_17",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "fabio@usuario.com",
		subject: "Resultados disponíveis",
		sentAt: "2024-04-23T07:20:00Z",
		createdAt: "2024-04-23T07:19:00Z",
	},
	{
		id: "log_18",
		type: "sms",
		status: "delivered",
		provider: "twilio",
		to: "+5511999990005",
		sentAt: "2024-04-23T07:10:00Z",
		createdAt: "2024-04-23T07:09:00Z",
	},
	{
		id: "log_19",
		type: "email",
		status: "delivered",
		provider: "resend",
		to: "gabi@corp.com",
		subject: "Notificação importante",
		sentAt: "2024-04-23T07:00:00Z",
		createdAt: "2024-04-23T06:59:00Z",
	},
	{
		id: "log_20",
		type: "push",
		status: "delivered",
		provider: "expo",
		to: "ExponentPushToken[mno345]",
		sentAt: "2024-04-23T06:50:00Z",
		createdAt: "2024-04-23T06:49:00Z",
	},
];

export function useNotificationLogs() {
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState<LogFilters>({});

	// TODO: replace with trpc.notifications.list.useQuery({ limit: PAGE_SIZE, offset: (page-1)*PAGE_SIZE, ...filters })
	const filtered = MOCK.filter((l) => {
		if (filters.type && l.type !== filters.type) return false;
		if (filters.status && l.status !== filters.status) return false;
		if (filters.search) {
			const q = filters.search.toLowerCase();
			if (!l.to.toLowerCase().includes(q)) return false;
		}
		return true;
	});
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		logs: items,
		total: filtered.length,
		page,
		setPage,
		filters,
		setFilters,
		isLoading: false as const,
		error: null,
	};
}
