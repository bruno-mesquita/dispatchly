import {
	NotificationLog,
	Organization,
	Subscription,
	Webhook,
} from "@dispatchly/db";
import { TRPCError } from "@trpc/server";
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

		get: adminProcedure
			.input(z.object({ id: z.string() }))
			.query(async ({ input }) => {
				const org = await Organization.findOne({ _id: input.id }).lean();
				if (!org) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Organization not found",
					});
				}
				const subscription = await Subscription.findOne({
					orgId: input.id,
				}).lean();
				return { ...org, subscription };
			}),

		update: adminProcedure
			.input(
				z.object({
					id: z.string(),
					plan: z.enum(["free", "basic", "pro", "enterprise"]).optional(),
				}),
			)
			.mutation(async ({ input }) => {
				const update: Record<string, unknown> = {};
				if (input.plan) update.plan = input.plan;
				const org = await Organization.findOneAndUpdate(
					{ _id: input.id },
					{ $set: update },
					{ new: true },
				).lean();
				if (input.plan) {
					await Subscription.findOneAndUpdate(
						{ orgId: input.id },
						{ $set: { plan: input.plan } },
						{ upsert: true, setDefaultsOnInsert: true },
					);
				}
				return org;
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

	webhooks: router({
		list: adminProcedure
			.input(
				pagination.extend({
					orgId: z.string().optional(),
				}),
			)
			.query(async ({ input }) => {
				const { page, limit, orgId } = input;
				const filter: Record<string, unknown> = {};
				if (orgId) filter.orgId = orgId;

				const skip = (page - 1) * limit;
				const [items, total] = await Promise.all([
					Webhook.find(filter)
						.sort({ createdAt: -1 })
						.skip(skip)
						.limit(limit)
						.lean(),
					Webhook.countDocuments(filter),
				]);

				const orgIds = [...new Set(items.map((w) => w.orgId))];
				const orgs = await Organization.find({ _id: { $in: orgIds } })
					.select("_id name")
					.lean();
				const orgMap = Object.fromEntries(
					orgs.map((o) => [String(o._id), o.name]),
				);

				return {
					items: items.map((w) => ({
						...w,
						id: String(w._id),
						orgName: orgMap[String(w.orgId)] ?? String(w.orgId),
					})),
					total,
					page,
					limit,
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
