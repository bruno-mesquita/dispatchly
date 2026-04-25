import { apiKey } from "@better-auth/api-key";
import { stripe } from "@better-auth/stripe";
import { client } from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, organization } from "better-auth/plugins";
import Stripe from "stripe";

export function createAuth() {
	const stripeClient = env.STRIPE_SECRET_KEY
		? new Stripe(env.STRIPE_SECRET_KEY, {
				apiVersion: "2026-03-25.dahlia" as any,
			})
		: null;

	return betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [
			apiKey(),
			organization(),
			admin(),
			...(stripeClient && env.STRIPE_WEBHOOK_SECRET
				? [
						stripe({
							stripeClient: stripeClient as any,
							stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
						}),
					]
				: []),
		],
	});
}

const authPromise = createAuth();

export { authPromise as auth };
