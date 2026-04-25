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
			findOne: mock(() => Promise.resolve({ plan: "free", status: "active" })),
		},
		Organization: {
			findOne: mock(() =>
				Promise.resolve({ usage: { emails: 0, sms: 0, push: 0 } }),
			),
			updateOne: mock(() => Promise.resolve({ acknowledged: true })),
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
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(100);
	});

	it("enterprise plan returns unlimited remaining", async () => {
		mock.module("@dispatchly/db", () => ({
			Subscription: {
				findOne: mock(() =>
					Promise.resolve({ plan: "enterprise", status: "active" }),
				),
			},
			Organization: {
				findOne: mock(() =>
					Promise.resolve({ usage: { emails: 99999, sms: 0, push: 0 } }),
				),
				updateOne: mock(() => Promise.resolve({ acknowledged: true })),
			},
		}));
		const result = await checkQuota("org_1", "emails");
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(-1);
	});

	it("past_due downgrades to free limits", async () => {
		mock.module("@dispatchly/db", () => ({
			Subscription: {
				findOne: mock(() =>
					Promise.resolve({ plan: "pro", status: "past_due" }),
				),
			},
			Organization: {
				findOne: mock(() =>
					Promise.resolve({ usage: { emails: 50, sms: 0, push: 0 } }),
				),
				updateOne: mock(() => Promise.resolve({ acknowledged: true })),
			},
		}));
		const result = await checkQuota("org_1", "emails");
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(50);
	});

	it("blocks send when over limit", async () => {
		mock.module("@dispatchly/db", () => ({
			Subscription: {
				findOne: mock(() =>
					Promise.resolve({ plan: "free", status: "active" }),
				),
			},
			Organization: {
				findOne: mock(() =>
					Promise.resolve({ usage: { emails: 100, sms: 0, push: 0 } }),
				),
				updateOne: mock(() => Promise.resolve({ acknowledged: true })),
			},
		}));
		const result = await checkQuota("org_1", "emails");
		expect(result.allowed).toBe(false);
		expect(result.remaining).toBe(0);
	});
});
