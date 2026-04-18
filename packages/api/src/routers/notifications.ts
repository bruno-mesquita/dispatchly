import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../index.js";
import { addToQueue, type JobData } from "@dispatchly/notifications";
import {
	createTemplate,
	getTemplatesByOrg,
	deleteTemplate,
} from "@dispatchly/templates";
import { applyTemplate } from "@dispatchly/templates";
import {
	getTemplateById,
	updateTemplate,
	type CreateTemplateInput,
} from "@dispatchly/templates";
import { NotificationLog } from "@dispatchly/db";
import { PLANS, checkQuota } from "@dispatchly/billing";

export const notificationsRouter = router({
	send: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]),
				to: z.string(),
				subject: z.string().optional(),
				content: z.string(),
				templateId: z.string().optional(),
				variables: z.record(z.unknown()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const orgId = ctx.session.user.id;

			const quota = await checkQuota(
				orgId,
				input.type === "email"
					? "emails"
					: input.type === "sms"
						? "sms"
						: "push",
			);
			if (!quota.allowed) {
				throw new Error("Quota exceeded");
			}

			let content = input.content;
			let subject = input.subject || "";

			if (input.templateId) {
				const rendered = await applyTemplate(
					input.templateId,
					input.variables || {},
				);
				content = rendered.content;
				subject = rendered.subject;
			}

			const log = new NotificationLog({
				orgId,
				type: input.type,
				provider:
					input.type === "email"
						? "resend"
						: input.type === "sms"
							? "twilio"
							: "expo",
				to: input.to,
				templateId: input.templateId,
				subject,
				content,
				status: "pending",
			});
			await log.save();

			const jobData: JobData = {
				organizationId: orgId,
				notificationLogId: log._id.toString(),
				type: input.type,
				to: input.to,
				subject,
				content,
			};

			await addToQueue(input.type, jobData);

			return { id: log._id, status: "pending" };
		}),
	list: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]).optional(),
				status: z.string().optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const query: Record<string, unknown> = { orgId: ctx.session.user.id };
			if (input.type) query.type = input.type;
			if (input.status) query.status = input.status;

			return NotificationLog.find(query)
				.sort({ createdAt: -1 })
				.limit(input.limit)
				.skip(input.offset);
		}),
	stats: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.session.user.id;
		const stats = await NotificationLog.aggregate([
			{ $match: { orgId } },
			{
				$group: {
					_id: "$type",
					total: { $sum: 1 },
					sent: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
					delivered: {
						$sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
					},
					failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
				},
			},
		]);
		return stats;
	}),
});

export const templatesRouter = router({
	list: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]).optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return getTemplatesByOrg(ctx.session.user.id, input.type);
		}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				type: z.enum(["email", "sms", "push"]),
				subject: z.string().optional(),
				content: z.string().min(1),
				variables: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return createTemplate({
				...input,
				orgId: ctx.session.user.id,
			});
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				subject: z.string().optional(),
				content: z.string().optional(),
				isActive: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			return updateTemplate(id, data);
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			return deleteTemplate(input.id);
		}),
});

export const billingRouter = router({
	getPlan: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.session.user.id;
		const plan = PLANS.find((p) => p.id === orgId);
		return plan || PLANS[0];
	}),
	createCheckoutSession: protectedProcedure
		.input(
			z.object({
				planId: z.string(),
				successUrl: z.string().url(),
				cancelUrl: z.string().url(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { createCheckoutSession } = await import("@dispatchly/billing");
			return createCheckoutSession(
				ctx.session.user.id,
				input.planId,
				input.successUrl,
				input.cancelUrl,
			);
		}),
	getPortalSession: protectedProcedure
		.input(z.object({ returnUrl: z.string().url() }))
		.mutation(async ({ input, ctx }) => {
			const { createPortalSession } = await import("@dispatchly/billing");
			return createPortalSession(ctx.session.user.id, input.returnUrl);
		}),
});
