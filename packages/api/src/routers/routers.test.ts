import { describe, expect, it, mock } from "bun:test";

process.env.DATABASE_URL = "mongodb://localhost:27017/test";
process.env.BETTER_AUTH_SECRET = "a".repeat(32);
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.REDIS_URL = "redis://localhost:6379";

// Mock DB
mock.module("@dispatchly/db", () => ({
	NotificationLog: {},
	Organization: {},
	Subscription: {},
	Template: {},
}));

import { appRouter } from "./index.js";

describe("API Routers", () => {
	it("should have all expected routers", () => {
		expect(appRouter.notifications).toBeDefined();
		expect(appRouter.templates).toBeDefined();
		expect(appRouter.billing).toBeDefined();
		expect(appRouter.organization).toBeDefined();
		expect(appRouter.admin).toBeDefined();
	});

	it("should respond to health check", async () => {
		const caller = appRouter.createCaller({
			session: null as any,
			headers: new Headers(),
		});
		const result = await caller.healthCheck();
		expect(result).toBe("OK");
	});
});
