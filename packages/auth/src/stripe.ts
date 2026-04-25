import { env } from "@dispatchly/env/server";
import Stripe from "stripe";

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2026-03-25.dahlia",
});
