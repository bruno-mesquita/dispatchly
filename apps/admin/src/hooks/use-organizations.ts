"use client";

import { useState } from "react";

export type Organization = {
	id: string;
	name: string;
	slug: string;
	plan: "free" | "basic" | "pro" | "enterprise";
	usage: { emails: number; sms: number; push: number };
	quota: { emails: number; sms: number; push: number };
	ownerId: string;
	createdAt: string;
};

const PAGE_SIZE = 20;

const MOCK: Organization[] = [
	{
		id: "org_1",
		name: "Acme Corp",
		slug: "acme-corp",
		plan: "pro",
		usage: { emails: 1250, sms: 340, push: 890 },
		quota: { emails: 5000, sms: 1000, push: 2000 },
		ownerId: "user_1",
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "org_2",
		name: "TechStartup Inc",
		slug: "techstartup",
		plan: "basic",
		usage: { emails: 320, sms: 45, push: 0 },
		quota: { emails: 1000, sms: 200, push: 0 },
		ownerId: "user_2",
		createdAt: "2024-02-20T14:30:00Z",
	},
	{
		id: "org_3",
		name: "Global Retail",
		slug: "global-retail",
		plan: "enterprise",
		usage: { emails: 18500, sms: 3200, push: 5600 },
		quota: { emails: 50000, sms: 10000, push: 20000 },
		ownerId: "user_3",
		createdAt: "2023-11-08T09:15:00Z",
	},
	{
		id: "org_4",
		name: "DevShop",
		slug: "devshop",
		plan: "free",
		usage: { emails: 45, sms: 0, push: 12 },
		quota: { emails: 100, sms: 0, push: 50 },
		ownerId: "user_4",
		createdAt: "2024-03-05T16:45:00Z",
	},
	{
		id: "org_5",
		name: "HealthTech",
		slug: "healthtech",
		plan: "pro",
		usage: { emails: 2800, sms: 1200, push: 400 },
		quota: { emails: 5000, sms: 2000, push: 1000 },
		ownerId: "user_5",
		createdAt: "2024-01-28T11:20:00Z",
	},
	{
		id: "org_6",
		name: "EduPlatform",
		slug: "edu-platform",
		plan: "basic",
		usage: { emails: 780, sms: 0, push: 230 },
		quota: { emails: 1000, sms: 200, push: 500 },
		ownerId: "user_6",
		createdAt: "2024-02-14T08:00:00Z",
	},
	{
		id: "org_7",
		name: "FinanceApp",
		slug: "finance-app",
		plan: "enterprise",
		usage: { emails: 32000, sms: 8900, push: 0 },
		quota: { emails: 100000, sms: 20000, push: 0 },
		ownerId: "user_7",
		createdAt: "2023-09-12T13:30:00Z",
	},
	{
		id: "org_8",
		name: "LocalBusiness",
		slug: "local-biz",
		plan: "free",
		usage: { emails: 12, sms: 5, push: 0 },
		quota: { emails: 100, sms: 20, push: 0 },
		ownerId: "user_8",
		createdAt: "2024-04-01T10:00:00Z",
	},
	{
		id: "org_9",
		name: "MediaGroup",
		slug: "media-group",
		plan: "pro",
		usage: { emails: 4200, sms: 0, push: 1800 },
		quota: { emails: 5000, sms: 1000, push: 3000 },
		ownerId: "user_9",
		createdAt: "2024-01-05T09:00:00Z",
	},
	{
		id: "org_10",
		name: "CloudSaaS",
		slug: "cloud-saas",
		plan: "basic",
		usage: { emails: 650, sms: 120, push: 85 },
		quota: { emails: 1000, sms: 200, push: 200 },
		ownerId: "user_10",
		createdAt: "2024-03-18T15:00:00Z",
	},
];

export function useOrganizations() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	// TODO: replace with trpc.admin.organizations.list.useQuery({ page, limit: PAGE_SIZE, search })
	const filtered = MOCK.filter(
		(o) =>
			!search ||
			o.name.toLowerCase().includes(search.toLowerCase()) ||
			o.slug.toLowerCase().includes(search.toLowerCase()),
	);
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		organizations: items,
		total: filtered.length,
		page,
		setPage,
		search,
		setSearch,
		isLoading: false as const,
		error: null,
	};
}
