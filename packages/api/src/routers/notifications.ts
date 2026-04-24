import { checkQuota } from "@dispatchly/billing";
import { NotificationLog } from "@dispatchly/db";
import { addToQueue, type JobData } from "@dispatchly/notifications";
import { applyTemplate } from "@dispatchly/templates";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";

export const notificationsRouter = router({
	send: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]),
				to: z.string(),
				subject: z.string().optional(),
				content: z.string(),
				templateId: z.string().optional(),
				variables: z.record(z.string(), z.unknown()).optional(),
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
				subject = rendered.subject || "";
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
