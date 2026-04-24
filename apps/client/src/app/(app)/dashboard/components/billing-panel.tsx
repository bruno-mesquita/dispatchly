"use client";

import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

const PLANS = [
	{ id: "free", name: "Free", price: "R$ 0", emails: 100, sms: 10, push: 50 },
	{
		id: "basic",
		name: "Basic",
		price: "R$ 49",
		emails: 1000,
		sms: 100,
		push: 500,
	},
	{
		id: "pro",
		name: "Pro",
		price: "R$ 199",
		emails: 5000,
		sms: 500,
		push: 2000,
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Sob consulta",
		emails: -1,
		sms: -1,
		push: -1,
	},
] as const;

export function BillingPanel() {
	const planQuery = useQuery(trpc.billing.getPlan.queryOptions() as any);
	const createCheckout = useMutation({
		mutationFn: async (input: any) =>
			(trpc.billing.createCheckoutSession as any).mutate(input),
	});

	const handleUpgrade = async (planId: string) => {
		try {
			const result = await createCheckout.mutateAsync({
				planId,
				successUrl: `${window.location.origin}/dashboard?success=true`,
				cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
			});
			if (result.url) {
				window.location.href = result.url;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const currentPlan = (planQuery.data as (typeof PLANS)[number]) ?? PLANS[0];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Plano Atual</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="font-bold text-2xl">{currentPlan.name}</p>
					<p className="text-muted-foreground">
						{currentPlan.emails === -1 ? "Ilimitado" : currentPlan.emails}{" "}
						emails,
						{currentPlan.sms === -1 ? " ilimitado" : ` ${currentPlan.sms}`} SMS,
						{currentPlan.push === -1 ? " ilimitado" : ` ${currentPlan.push}`}{" "}
						push
					</p>
				</CardContent>
			</Card>

			<div className="grid grid-cols-4 gap-4">
				{PLANS.map((plan) => (
					<Card
						key={plan.id}
						className={plan.id === currentPlan.id ? "border-primary" : ""}
					>
						<CardHeader>
							<CardTitle>{plan.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="font-bold text-xl">{plan.price}/mês</p>
							<ul className="mt-2 space-y-1 text-muted-foreground text-sm">
								<li>{plan.emails === -1 ? "Ilimitado" : plan.emails} emails</li>
								<li>{plan.sms === -1 ? "Ilimitado" : plan.sms} SMS</li>
								<li>{plan.push === -1 ? "Ilimitado" : plan.push} push</li>
							</ul>
							{plan.id !== "free" && (
								<Button
									className="mt-4 w-full"
									variant={plan.id === currentPlan.id ? "outline" : "default"}
									disabled={
										plan.id === currentPlan.id || createCheckout.isPending
									}
									onClick={() => handleUpgrade(plan.id)}
								>
									{plan.id === currentPlan.id ? "Plano Atual" : "Upgrade"}
								</Button>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
