import { z } from "zod";
import { NotificationLog } from "@dispatchly/db";
import { protectedProcedure, router } from "../index.js";
import { sendNotification } from "../services/notifications.js";

export const notificationsRouter = router({
	send: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]),
				to: z.string(),
				subject: z.string().optional(),
				content: z.string().optional(),
				templateId: z.string().optional(),
				variables: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return sendNotification(input, ctx.session.user.id);
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
