"use client";

import { useState } from "react";

import type { Organization } from "./use-organizations";

const MOCK_ORGS: Organization[] = [
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
];

export function useOrganization(id: string) {
	const [org, setOrg] = useState<Organization | null>(
		MOCK_ORGS.find((o) => o.id === id) ?? MOCK_ORGS[0] ?? null,
	);

	// TODO: replace with trpc.admin.organizations.get.useQuery({ id })
	// TODO: replace update with trpc.admin.organizations.update.useMutation()
	function update(data: Partial<Pick<Organization, "plan">>) {
		setOrg((prev) => (prev ? { ...prev, ...data } : prev));
	}

	return {
		organization: org,
		update,
		isLoading: false as const,
		error: null,
	};
}
