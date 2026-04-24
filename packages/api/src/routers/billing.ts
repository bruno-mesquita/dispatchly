import { PLANS } from "@dispatchly/billing";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";

export const billingRouter = router({
	getPlan: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.session.user.id;
		const plan = PLANS.find((p) => p.id === orgId);
		return plan || PLANS[0];
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
				ctx.session.user.id,
				input.planId,
				input.successUrl,
				input.cancelUrl,
			);
		}),
	getPortalSession: protectedProcedure
		.input(z.object({ returnUrl: z.string().url() }))
		.mutation(async ({ input, ctx }) => {
			const { createPortalSession } = await import("@dispatchly/billing");
			return createPortalSession(ctx.session.user.id, input.returnUrl);
		}),
});
