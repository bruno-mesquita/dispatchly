"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "@/utils/trpc";

export type Webhook = {
	id: string;
	orgId: string;
	orgName: string;
	name: string;
	url: string;
	events: string[];
	isActive: boolean;
	lastTriggeredAt?: string;
	createdAt: string;
};

const PAGE_SIZE = 20;

export function useWebhooks(defaultOrgId?: string) {
	const [page, setPage] = useState(1);
	const [orgId] = useState<string | undefined>(defaultOrgId);

	const query = useQuery(
		trpc.admin.webhooks.list.queryOptions({
			page,
			limit: PAGE_SIZE,
			orgId,
		}),
	);

	return {
		webhooks: query.data?.items ?? [],
		total: query.data?.total ?? 0,
		page,
		setPage,
		isLoading: query.isLoading,
		error: query.error,
	};
}
