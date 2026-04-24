import { describe, expect, it, mock } from "bun:test";

process.env.DATABASE_URL = "mongodb://localhost:27017/test";
process.env.BETTER_AUTH_SECRET = "a".repeat(32);
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.RESEND_API_KEY = "test";
process.env.TWILIO_ACCOUNT_SID = "test";
process.env.TWILIO_AUTH_TOKEN = "test";
process.env.TWILIO_PHONE_NUMBER = "test";
process.env.EXPO_ACCESS_TOKEN = "test";

import { expoProvider } from "./expo.js";
import { resendProvider } from "./resend.js";
import { twilioProvider } from "./twilio.js";

describe("Notification Providers", () => {
	describe("ResendProvider", () => {
		it("should be named resend", () => {
			expect(resendProvider.name).toBe("resend");
		});
	});

	describe("TwilioProvider", () => {
		it("should be named twilio", () => {
			expect(twilioProvider.name).toBe("twilio");
		});
	});

	describe("ExpoProvider", () => {
		it("should be named expo", () => {
			expect(expoProvider.name).toBe("expo");
		});
	});
});
