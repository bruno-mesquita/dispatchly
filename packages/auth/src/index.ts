import { apiKey } from "@better-auth/api-key";
import { stripe } from "@better-auth/stripe";
import { client } from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, organization } from "better-auth/plugins";
import { stripeClient } from "./stripe";

export const auth = betterAuth({
	database: mongodbAdapter(client),
	trustedOrigins: [env.CORS_ORIGIN],
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
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
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
		}),
	],
});
