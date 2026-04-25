"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type PlanId, planLimits } from "@/lib/plan-limits";
import { trpc } from "@/utils/trpc";
import type { Organization } from "./use-organizations";

type ServerOrg = {
	_id: string;
	name: string;
	slug: string;
	plan?: string;
	usage?: { emails?: number; sms?: number; push?: number };
	ownerId: string;
	createdAt: string | Date;
};

function adapt(org: ServerOrg): Organization {
	const plan = (org.plan ?? "free") as PlanId;
	return {
		id: String(org._id),
		name: org.name,
		slug: org.slug,
		plan,
		usage: {
			emails: org.usage?.emails ?? 0,
			sms: org.usage?.sms ?? 0,
			push: org.usage?.push ?? 0,
		},
		quota: planLimits(plan),
		ownerId: org.ownerId,
		createdAt:
			typeof org.createdAt === "string"
				? org.createdAt
				: new Date(org.createdAt).toISOString(),
	};
}

export function useOrganization(id: string) {
	const qc = useQueryClient();
	const query = useQuery(trpc.admin.organizations.get.queryOptions({ id }));
	const updateMutation = useMutation(
		trpc.admin.organizations.update.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: trpc.admin.organizations.get.queryKey({ id }),
				});
				qc.invalidateQueries({
					queryKey: trpc.admin.organizations.list.queryKey(),
				});
			},
		}),
	);

	const organization = query.data ? adapt(query.data as ServerOrg) : null;

	function update(data: Partial<Pick<Organization, "plan">>) {
		if (!data.plan) return;
		updateMutation.mutate({ id, plan: data.plan });
	}

	return {
		organization,
		update,
		isLoading: query.isLoading,
		error: query.error,
	};
}
