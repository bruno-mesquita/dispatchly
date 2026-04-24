import { createContext } from "@dispatchly/api/context";
import { appRouter } from "@dispatchly/api/routers/index";
import { sendNotification } from "@dispatchly/api/services/notifications";
import { auth } from "@dispatchly/auth";
import { env } from "@dispatchly/env/server";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia, t } from "elysia";

const authInstance = await auth;

new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return authInstance.handler(request);
		}
		return status(405);
	})
	.all("/trpc/*", async (context) => {
		const res = await fetchRequestHandler({
			endpoint: "/trpc",
			router: appRouter,
			req: context.request,
			createContext: () => createContext({ context }),
		});
		return res;
	})
	.post(
		"/v1/send",
		async ({ body, headers, set }) => {
			const apiKey = headers.authorization?.split(" ")[1];
			if (!apiKey) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const key = await authInstance.api.verifyApiKey({
				headers: new Headers({ authorization: `Bearer ${apiKey}` }),
			});

			if (!key) {
				set.status = 401;
				return { error: "Invalid API Key" };
			}

			try {
				const results = await Promise.all(
					body.channels.map((channel) =>
						sendNotification(
							{
								type: channel as "email" | "sms" | "push",
								to: body.to,
								templateId: body.template,
								variables: body.data,
							},
							key.userId,
						),
					),
				);

				// Return the first one as primary ID for simplicity, matching snippet return type
				return results[0];
			} catch (error) {
				set.status = 400;
				return { error: (error as Error).message };
			}
		},
		{
			body: t.Object({
				to: t.String(),
				template: t.String(),
				channels: t.Array(t.String()),
				data: t.Record(t.String(), t.Any()),
			}),
		},
	)
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
