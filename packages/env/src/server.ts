import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.string().min(1),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		REDIS_URL: z.string().min(1),
		RESEND_API_KEY: z.string().optional(),
		RESEND_FROM_EMAIL: z.string().optional(),
		TWILIO_ACCOUNT_SID: z.string().optional(),
		TWILIO_AUTH_TOKEN: z.string().optional(),
		TWILIO_PHONE_NUMBER: z.string().optional(),
		EXPO_ACCESS_TOKEN: z.string().optional(),
		STRIPE_SECRET_KEY: z.string().optional(),
		STRIPE_WEBHOOK_SECRET: z.string().optional(),
		ADMIN_EMAILS: z.string().optional(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
