import { describe, expect, it, mock, spyOn } from "bun:test";
import { Dispatchly } from "../index";

describe("Dispatchly SDK", () => {
	const apiKey = "test-key";
	const dx = new Dispatchly({ apiKey });

	it("should send a notification", async () => {
		const mockResponse = { id: "msg_123", status: "queued" };

		// Mock global fetch
		global.fetch = mock(() =>
			Promise.resolve(
				new Response(JSON.stringify(mockResponse), { status: 200 }),
			),
		) as any;

		const result = await dx.send({
			to: "user_1",
			template: "welcome",
			channels: ["email"],
			data: { name: "John" },
		});

		expect(result).toEqual(mockResponse);
		expect(global.fetch).toHaveBeenCalled();

		const [url, init] = (global.fetch as any).mock.calls[0];
		expect(url).toBe("https://api.dispatchly.com/v1/send");
		expect(init.method).toBe("POST");
		expect(init.headers.Authorization).toBe(`Bearer ${apiKey}`);
	});

	it("should handle API errors", async () => {
		global.fetch = mock(() =>
			Promise.resolve(
				new Response(JSON.stringify({ error: "Invalid API Key" }), {
					status: 401,
				}),
			),
		) as any;

		try {
			await dx.send({
				to: "user_1",
				template: "welcome",
				channels: ["email"],
				data: {},
			});
			expect(true).toBe(false); // Should not reach here
		} catch (error: any) {
			expect(error.name).toBe("DispatchlyError");
			expect(error.status).toBe(401);
			expect(error.message).toBe("Invalid API Key");
		}
	});

	it("should manage templates", async () => {
		const mockTemplate = { id: "tpl_1", name: "Welcome", type: "email" };

		global.fetch = mock(() =>
			Promise.resolve(
				new Response(JSON.stringify(mockTemplate), { status: 200 }),
			),
		) as any;

		const result = await dx.templates.get("tpl_1");
		expect(result).toEqual(mockTemplate as any);
		expect(global.fetch).toHaveBeenCalled();

		const [url, init] = (global.fetch as any).mock.calls[0];
		expect(url).toBe("https://api.dispatchly.com/v1/templates/tpl_1");
		expect(init.method).toBe("GET");
	});
});
