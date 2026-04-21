import { NotificationLog, Organization, Subscription } from "@dispatchly/db";
import { z } from "zod";

import { adminProcedure, router } from "../index.js";

const pagination = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
});

export const adminRouter = router({
	organizations: router({
		list: adminProcedure.input(pagination).query(async ({ input }) => {
			const skip = (input.page - 1) * input.limit;
			const [items, total] = await Promise.all([
				Organization.find({})
					.select("name slug plan usage ownerId createdAt")
					.skip(skip)
					.limit(input.limit)
					.lean(),
				Organization.countDocuments(),
			]);
			return { items, total, page: input.page, limit: input.limit };
		}),
	}),

	subscriptions: router({
		list: adminProcedure.input(pagination).query(async ({ input }) => {
			const skip = (input.page - 1) * input.limit;
			const [subs, total] = await Promise.all([
				Subscription.find({}).skip(skip).limit(input.limit).lean(),
				Subscription.countDocuments(),
			]);
			const orgIds = subs.map((s) => s.orgId);
			const orgs = await Organization.find({ _id: { $in: orgIds } })
				.select("_id name")
				.lean();
			const orgMap = Object.fromEntries(
				orgs.map((o) => [String(o._id), o.name]),
			);
			return {
				items: subs.map((s) => ({
					...s,
					orgName: orgMap[String(s.orgId)] ?? String(s.orgId),
				})),
				total,
				page: input.page,
				limit: input.limit,
			};
		}),
	}),

	logs: router({
		list: adminProcedure
			.input(
				pagination.extend({
					type: z.enum(["email", "sms", "push"]).optional(),
					status: z
						.enum(["pending", "sent", "delivered", "failed", "bounced"])
						.optional(),
					orgId: z.string().optional(),
				}),
			)
			.query(async ({ input }) => {
				const { page, limit, type, status, orgId } = input;
				const filter: Record<string, unknown> = {};
				if (type) filter.type = type;
				if (status) filter.status = status;
				if (orgId) filter.orgId = orgId;
				const skip = (page - 1) * limit;
				const [items, total] = await Promise.all([
					NotificationLog.find(filter)
						.sort({ createdAt: -1 })
						.skip(skip)
						.limit(limit)
						.lean(),
					NotificationLog.countDocuments(filter),
				]);
				return { items, total, page, limit };
			}),
	}),

	analytics: router({
		overview: adminProcedure.query(async () => {
			const [orgsByPlan, notifByTypeStatus, activeSubs, totalOrgs, totalLogs] =
				await Promise.all([
					Organization.aggregate([
						{ $group: { _id: "$plan", count: { $sum: 1 } } },
					]),
					NotificationLog.aggregate([
						{
							$group: {
								_id: { type: "$type", status: "$status" },
								count: { $sum: 1 },
							},
						},
					]),
					Subscription.countDocuments({ status: "active" }),
					Organization.countDocuments(),
					NotificationLog.countDocuments(),
				]);
			return {
				orgsByPlan,
				notifByTypeStatus,
				activeSubs,
				totalOrgs,
				totalLogs,
			};
		}),
	}),
});
