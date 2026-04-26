import { createContext } from "@dispatchly/api/context";
import { appRouter } from "@dispatchly/api/routers/index";
import { sendNotification } from "@dispatchly/api/services/notifications";
import { auth } from "@dispatchly/auth";
import { env } from "@dispatchly/env/server";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";

const origins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

new Elysia()
	.use(
		cors({
			origin: origins,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(
		rateLimit({
			duration: 60000,
			max: 100,
			generator: (req, server) => {
				return server?.requestIP(req)?.address || "127.0.0.1";
			},
		}),
	)
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
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

			const keyResult = await auth.api.verifyApiKey({
				body: { key: apiKey },
			});

			if (!keyResult?.valid || !keyResult.key) {
				set.status = 401;
				return { error: "Invalid API Key" };
			}

			const ownerId = keyResult.key.referenceId;

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
							ownerId,
						),
					),
				);

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
			rateLimit: {
				duration: 60000,
				max: 1000,
				generator: (req: Request) => {
					const authHeader = req.headers.get("authorization");
					return authHeader?.split(" ")[1] || "anonymous";
				},
			},
		},
	)
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
