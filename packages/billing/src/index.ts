import {
	Organization as OrganizationModel,
	Subscription as SubscriptionModel,
} from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import Stripe from "stripe";

const stripe = env.STRIPE_SECRET_KEY
	? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" })
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

	let subscription = await SubscriptionModel.findOne({ orgId });
	if (!subscription) {
		subscription = new SubscriptionModel({
			orgId,
			plan: "free",
			status: "active",
		});
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

	const subscription = await SubscriptionModel.findOne({ orgId });
	if (!subscription?.stripeCustomerId) {
		throw new Error("No subscription found");
	}

	const session = await stripe.billingPortal.sessions.create({
		customer: subscription.stripeCustomerId,
		return_url: returnUrl,
	});

	return session;
}

type StripeSubWithPeriod = Stripe.Subscription & {
	current_period_start: number;
	current_period_end: number;
};

function customerIdFrom(sub: Stripe.Subscription): string | undefined {
	return typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
}

function planIdFromMetadata(
	metadata: Stripe.Metadata | null | undefined,
): string {
	const id = metadata?.planId;
	return PLANS.find((p) => p.id === id)?.id ?? "free";
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
			const stripeSub = event.data.object as StripeSubWithPeriod;
			const orgId = stripeSub.metadata?.orgId;
			if (!orgId) break;

			await SubscriptionModel.findOneAndUpdate(
				{ orgId },
				{
					stripeCustomerId: customerIdFrom(stripeSub),
					stripeSubscriptionId: stripeSub.id,
					status: stripeSub.status,
					plan: planIdFromMetadata(stripeSub.metadata),
					currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
					currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
				},
				{ upsert: true, setDefaultsOnInsert: true },
			);
			break;
		}

		case "customer.subscription.deleted": {
			const stripeSub = event.data.object as Stripe.Subscription;
			await SubscriptionModel.findOneAndUpdate(
				{ stripeSubscriptionId: stripeSub.id },
				{ status: "canceled" },
			);
			break;
		}

		case "invoice.payment_failed": {
			const invoice = event.data.object as Stripe.Invoice & {
				subscription?: string | Stripe.Subscription | null;
			};
			const subId =
				typeof invoice.subscription === "string"
					? invoice.subscription
					: invoice.subscription?.id;
			if (!subId) break;
			await SubscriptionModel.findOneAndUpdate(
				{ stripeSubscriptionId: subId },
				{ status: "past_due" },
			);
			break;
		}

		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			const orgId = session.metadata?.orgId;
			const customerId =
				typeof session.customer === "string"
					? session.customer
					: session.customer?.id;
			if (!orgId || !customerId) break;
			await SubscriptionModel.findOneAndUpdate(
				{ orgId },
				{ stripeCustomerId: customerId },
				{ upsert: true, setDefaultsOnInsert: true },
			);
			break;
		}
	}

	return { received: true };
}

export async function getSubscription(orgId: string) {
	return SubscriptionModel.findOne({ orgId });
}

export async function checkQuota(
	orgId: string,
	type: "emails" | "sms" | "push",
): Promise<{ allowed: boolean; remaining: number }> {
	const [subscription, organization] = await Promise.all([
		SubscriptionModel.findOne({ orgId }),
		OrganizationModel.findOne({ _id: orgId }),
	]);

	const planId =
		subscription?.status === "past_due" || subscription?.status === "canceled"
			? "free"
			: (subscription?.plan ?? "free");
	const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
	const limit = plan.limits[type] ?? 0;

	if (limit === -1) return { allowed: true, remaining: -1 };

	const used =
		(organization?.usage as Record<string, number> | undefined)?.[type] ?? 0;
	const remaining = Math.max(0, limit - used);
	return { allowed: remaining > 0, remaining };
}

export async function incrementUsage(
	orgId: string,
	type: "emails" | "sms" | "push",
	amount = 1,
): Promise<void> {
	await OrganizationModel.updateOne(
		{ _id: orgId },
		{ $inc: { [`usage.${type}`]: amount } },
	);
}

export async function resetUsage(orgId: string): Promise<void> {
	await OrganizationModel.updateOne(
		{ _id: orgId },
		{
			$set: {
				"usage.emails": 0,
				"usage.sms": 0,
				"usage.push": 0,
				lastResetAt: new Date(),
			},
		},
	);
}

export {
	billingCronQueue,
	runMonthlyResetSweep,
	startBillingCron,
	stopBillingCron,
} from "./cron.js";
