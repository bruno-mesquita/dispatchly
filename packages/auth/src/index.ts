import { apiKey } from "@better-auth/api-key";
import { client } from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, organization, stripe } from "better-auth/plugins";

export function createAuth() {
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
			stripe({
				stripeClient: null, // Initialized on demand if needed
				stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
			}),
		],
	});
}

const authPromise = createAuth();

export { authPromise as auth };
