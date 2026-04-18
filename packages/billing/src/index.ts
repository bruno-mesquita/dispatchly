import Stripe from "stripe";
import { env } from "@dispatchly/env/server";
import { Subscription } from "@dispatchly/db";

const stripe = env.STRIPE_SECRET_KEY
	? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" })
	: null;

export const PLANS = [
	{
		id: "free",
		name: "Free",
		price: 0,
		limits: { emails: 100, sms: 50, push: 100 },
	},
	{
		id: "basic",
		name: "Basic",
		price: 2900,
		limits: { emails: 1000, sms: 500, push: 500 },
	},
	{
		id: "pro",
		name: "Pro",
		price: 9900,
		limits: { emails: 10000, sms: 5000, push: 5000 },
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: 0,
		limits: { emails: -1, sms: -1, push: -1 },
	},
];

export async function createCheckoutSession(
	orgId: string,
	planId: string,
	successUrl: string,
	cancelUrl: string,
) {
	if (!stripe) throw new Error("Stripe not configured");

	const plan = PLANS.find((p) => p.id === planId);
	if (!plan) throw new Error("Plan not found");

	let subscription = await Subscription.findOne({ orgId });
	if (!subscription) {
		subscription = new Subscription({ orgId, plan: "free", status: "active" });
		await subscription.save();
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: plan.name },
					unit_amount: plan.price,
					recurring: { interval: "month" },
				},
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata: { orgId, planId },
	});

	return session;
}

export async function createPortalSession(orgId: string, returnUrl: string) {
	if (!stripe) throw new Error("Stripe not configured");

	const subscription = await Subscription.findOne({ orgId });
	if (!subscription?.stripeCustomerId) {
		throw new Error("No subscription found");
	}

	const session = await stripe.billingPortal.sessions.create({
		customer: subscription.stripeCustomerId,
		return_url: returnUrl,
	});

	return session;
}

export async function handleWebhook(body: string, signature: string) {
	if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
		throw new Error("Stripe not configured");
	}

	const event = stripe.webhooks.constructEvent(
		body,
		signature,
		env.STRIPE_WEBHOOK_SECRET,
	);

	switch (event.type) {
		case "customer.subscription.created":
		case "customer.subscription.updated": {
			const subscription = event.data.object as Stripe.Subscription;
			const orgId = subscription.metadata?.orgId;

			if (orgId) {
				await Subscription.findOneAndUpdate(
					{ orgId },
					{
						stripeSubscriptionId: subscription.id,
						status: subscription.status,
						plan:
							PLANS.find((p) => p.id === subscription.metadata?.planId)?.id ||
							"free",
						currentPeriodStart: new Date(
							subscription.current_period_start * 1000,
						),
						currentPeriodEnd: new Date(subscription.current_period_end * 1000),
					},
					{ upsert: true },
				);
			}
			break;
		}
		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;
			await Subscription.findOneAndUpdate(
				{ stripeSubscriptionId: subscription.id },
				{ status: "canceled" },
			);
			break;
		}
	}

	return { received: true };
}

export async function getSubscription(orgId: string) {
	return Subscription.findOne({ orgId });
}

export async function checkQuota(
	orgId: string,
	type: "emails" | "sms" | "push",
): Promise<{ allowed: boolean; remaining: number }> {
	const subscription = await Subscription.findOne({ orgId });
	const plan = PLANS.find((p) => p.id === subscription?.plan || "free");
	const limit = plan?.limits[type] ?? 0;

	if (limit === -1) return { allowed: true, remaining: -1 };

	const remaining = limit;
	return { allowed: remaining > 0, remaining };
}
