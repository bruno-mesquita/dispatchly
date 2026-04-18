import { auth } from "@dispatchly/auth";
import type { Context as ElysiaContext } from "elysia";

export type CreateContextOptions = {
	context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const authInstance = await auth;
	const session = await authInstance.api.getSession({
		headers: context.request.headers,
	});
	return {
		auth: authInstance,
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
