"use client";

import { useState } from "react";

import type { LogType } from "./use-logs";

export type Template = {
	id: string;
	orgId: string;
	orgName: string;
	name: string;
	type: LogType;
	subject?: string;
	variables: string[];
	isActive: boolean;
	createdAt: string;
};

const PAGE_SIZE = 20;

const MOCK: Template[] = [
	{
		id: "tpl_1",
		orgId: "org_1",
		orgName: "Acme Corp",
		name: "Welcome Email",
		type: "email",
		subject: "Welcome to {{company}}!",
		variables: ["company", "name", "link"],
		isActive: true,
		createdAt: "2024-01-16T10:00:00Z",
	},
	{
		id: "tpl_2",
		orgId: "org_1",
		orgName: "Acme Corp",
		name: "Invoice Ready",
		type: "email",
		subject: "Your invoice #{{invoiceId}} is ready",
		variables: ["invoiceId", "amount", "dueDate"],
		isActive: true,
		createdAt: "2024-01-20T10:00:00Z",
	},
	{
		id: "tpl_3",
		orgId: "org_3",
		orgName: "Global Retail",
		name: "Order Shipped",
		type: "email",
		subject: "Your order #{{orderId}} has shipped!",
		variables: ["orderId", "trackingUrl", "estimatedDelivery"],
		isActive: true,
		createdAt: "2023-11-10T09:00:00Z",
	},
	{
		id: "tpl_4",
		orgId: "org_3",
		orgName: "Global Retail",
		name: "Order Shipped SMS",
		type: "sms",
		variables: ["orderId", "trackingUrl"],
		isActive: true,
		createdAt: "2023-11-10T09:30:00Z",
	},
	{
		id: "tpl_5",
		orgId: "org_5",
		orgName: "HealthTech",
		name: "Appointment Reminder",
		type: "email",
		subject: "Reminder: appointment on {{date}}",
		variables: ["date", "time", "doctor", "location"],
		isActive: true,
		createdAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "tpl_6",
		orgId: "org_5",
		orgName: "HealthTech",
		name: "Appointment SMS",
		type: "sms",
		variables: ["date", "time", "doctor"],
		isActive: true,
		createdAt: "2024-02-01T10:30:00Z",
	},
	{
		id: "tpl_7",
		orgId: "org_7",
		orgName: "FinanceApp",
		name: "Transaction Alert",
		type: "email",
		subject: "Transaction of {{amount}} on your account",
		variables: ["amount", "merchant", "date", "last4"],
		isActive: true,
		createdAt: "2023-09-15T10:00:00Z",
	},
	{
		id: "tpl_8",
		orgId: "org_7",
		orgName: "FinanceApp",
		name: "2FA Code",
		type: "sms",
		variables: ["code", "expiry"],
		isActive: true,
		createdAt: "2023-09-15T11:00:00Z",
	},
	{
		id: "tpl_9",
		orgId: "org_6",
		orgName: "EduPlatform",
		name: "Course Update",
		type: "email",
		subject: "New content in {{courseName}}",
		variables: ["courseName", "lessonTitle", "link"],
		isActive: true,
		createdAt: "2024-02-15T10:00:00Z",
	},
	{
		id: "tpl_10",
		orgId: "org_9",
		orgName: "MediaGroup",
		name: "New Article Push",
		type: "push",
		variables: ["title", "excerpt", "articleId"],
		isActive: false,
		createdAt: "2024-01-06T10:00:00Z",
	},
];

export function useTemplates(defaultOrgId?: string) {
	const [page, setPage] = useState(1);
	const [typeFilter, setTypeFilter] = useState<LogType | "all">("all");
	const [orgId] = useState<string | undefined>(defaultOrgId);

	// TODO: replace with trpc.admin.templates.list.useQuery({ page, limit: PAGE_SIZE, type: typeFilter, orgId })
	const filtered = MOCK.filter((t) => {
		if (orgId && t.orgId !== orgId) return false;
		if (typeFilter !== "all" && t.type !== typeFilter) return false;
		return true;
	});
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		templates: items,
		total: filtered.length,
		page,
		setPage,
		typeFilter,
		setTypeFilter,
		isLoading: false as const,
		error: null,
	};
}
