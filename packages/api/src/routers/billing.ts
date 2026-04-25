import { PLANS } from "@dispatchly/billing";
import { Organization, Subscription } from "@dispatchly/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";

export const billingRouter = router({
	getPlan: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.orgId;
		const [subscription, organization] = await Promise.all([
			Subscription.findOne({ orgId }).lean(),
			Organization.findOne({ _id: orgId }).select("usage lastResetAt").lean(),
		]);
		const planId = subscription?.plan ?? "free";
		const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
		return {
			plan,
			plans: PLANS,
			subscription,
			usage: organization?.usage ?? { emails: 0, sms: 0, push: 0 },
			lastResetAt:
				(organization as { lastResetAt?: Date } | null)?.lastResetAt ?? null,
		};
	}),

	createCheckoutSession: protectedProcedure
		.input(
			z.object({
				planId: z.string(),
				successUrl: z.string().url(),
				cancelUrl: z.string().url(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { createCheckoutSession } = await import("@dispatchly/billing");
			return createCheckoutSession(
				ctx.orgId,
				input.planId,
				input.successUrl,
				input.cancelUrl,
			);
		}),

	getPortalSession: protectedProcedure
		.input(z.object({ returnUrl: z.string().url() }))
		.mutation(async ({ input, ctx }) => {
			const { createPortalSession } = await import("@dispatchly/billing");
			return createPortalSession(ctx.orgId, input.returnUrl);
		}),
});
