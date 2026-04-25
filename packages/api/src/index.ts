import { Organization } from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	const userId = ctx.session.user.id;
	const org = await Organization.findOne({ ownerId: userId })
		.select("_id")
		.lean();
	if (!org) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Organization not found for current user",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
			orgId: String(org._id),
		},
	});
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
		});
	}
	const adminEmails = (env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((e) => e.trim())
		.filter(Boolean);
	if (!adminEmails.includes(ctx.session.user.email)) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Admin access required",
		});
	}
	return next({ ctx: { ...ctx, session: ctx.session } });
});
