import { describe, expect, it, mock } from "bun:test";

process.env.DATABASE_URL = "mongodb://localhost:27017/test";
process.env.BETTER_AUTH_SECRET = "a".repeat(32);
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.STRIPE_SECRET_KEY = "sk_test";

import { checkQuota, PLANS } from "./index.js";

// Mock DB
mock.module("@dispatchly/db", () => {
	return {
		Subscription: {
			findOne: mock(() => Promise.resolve({ plan: "free" })),
		},
	};
});

describe("Billing System", () => {
	it("should have defined plans", () => {
		expect(PLANS.length).toBeGreaterThan(0);
		expect(PLANS[0].id).toBe("free");
	});

	it("should check quota correctly", async () => {
		const result = await checkQuota("org_1", "emails");
		expect(result.allowed).toBeDefined();
		expect(result.remaining).toBeDefined();
	});
});
