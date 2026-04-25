export type PlanId = "free" | "basic" | "pro" | "enterprise";

export const PLAN_LIMITS: Record<
	PlanId,
	{ emails: number; sms: number; push: number }
> = {
	free: { emails: 100, sms: 50, push: 100 },
	basic: { emails: 1000, sms: 500, push: 500 },
	pro: { emails: 10000, sms: 5000, push: 5000 },
	enterprise: { emails: -1, sms: -1, push: -1 },
};

export function planLimits(plan: string): {
	emails: number;
	sms: number;
	push: number;
} {
	return PLAN_LIMITS[plan as PlanId] ?? PLAN_LIMITS.free;
}

export function formatLimit(value: number): string {
	return value === -1 ? "∞" : value.toLocaleString();
}
