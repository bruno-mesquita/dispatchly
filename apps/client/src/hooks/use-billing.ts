"use client";

export type PlanName = "free" | "basic" | "pro" | "enterprise";

export type CurrentPlan = {
	name: PlanName;
	quota: { emails: number; sms: number; push: number };
	usage: { emails: number; sms: number; push: number };
	renewsAt: string;
	stripeCustomerId?: string;
};

export type AvailablePlan = {
	id: PlanName;
	label: string;
	price: string;
	features: string[];
	quota: { emails: number; sms: number; push: number };
};

const CURRENT_PLAN: CurrentPlan = {
	name: "basic",
	quota: { emails: 1000, sms: 200, push: 500 },
	usage: { emails: 320, sms: 45, push: 0 },
	renewsAt: "2024-05-01T00:00:00Z",
	stripeCustomerId: "cus_def456",
};

const AVAILABLE_PLANS: AvailablePlan[] = [
	{
		id: "free",
		label: "Free",
		price: "R$ 0/mês",
		features: [
			"100 emails/mês",
			"20 SMS/mês",
			"Sem push",
			"Suporte comunidade",
		],
		quota: { emails: 100, sms: 20, push: 0 },
	},
	{
		id: "basic",
		label: "Basic",
		price: "R$ 49/mês",
		features: [
			"1.000 emails/mês",
			"200 SMS/mês",
			"500 push/mês",
			"Suporte por email",
		],
		quota: { emails: 1000, sms: 200, push: 500 },
	},
	{
		id: "pro",
		label: "Pro",
		price: "R$ 199/mês",
		features: [
			"5.000 emails/mês",
			"1.000 SMS/mês",
			"2.000 push/mês",
			"Suporte prioritário",
			"Webhooks avançados",
		],
		quota: { emails: 5000, sms: 1000, push: 2000 },
	},
	{
		id: "enterprise",
		label: "Enterprise",
		price: "Sob consulta",
		features: [
			"Volume ilimitado",
			"SLA garantido",
			"Suporte dedicado",
			"IP dedicado",
			"SSO",
		],
		quota: { emails: 100000, sms: 20000, push: 50000 },
	},
];

// TODO: replace with trpc.billing.getPlan.useQuery() + trpc.billing.createCheckoutSession.useMutation() + trpc.billing.getPortalSession.useMutation()
export function useBilling() {
	async function createCheckout(_planId: PlanName) {
		// TODO: replace with trpc.billing.createCheckoutSession.mutate({ planId, successUrl, cancelUrl })
		alert(`Mock: redirecionaria para checkout do plano "${_planId}"`);
	}

	async function openPortal() {
		// TODO: replace with trpc.billing.getPortalSession.mutate({ returnUrl })
		alert("Mock: redirecionaria para o portal Stripe");
	}

	return {
		plan: CURRENT_PLAN,
		plans: AVAILABLE_PLANS,
		createCheckout,
		openPortal,
		isLoading: false as const,
		error: null,
	};
}
