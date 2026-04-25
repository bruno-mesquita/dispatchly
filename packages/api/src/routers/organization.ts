import { Organization } from "@dispatchly/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { logAuditAction } from "../services/audit.js";

export const organizationRouter = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		return Organization.findOne({ ownerId: ctx.session.user.id }).lean();
	}),

	update: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).optional(),
				slug: z.string().min(1).optional(),
				settings: z
					.object({
						emailProvider: z.enum(["resend", "aws-ses", "sendgrid"]).optional(),
						smsProvider: z.string().optional(),
						timezone: z.string().optional(),
						webhookUrl: z.string().url().optional().or(z.literal("")),
						webhookSecret: z.string().optional(),
					})
					.optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const ownerId = ctx.session.user.id;

			const setFields: Record<string, unknown> = {};
			if (input.name) setFields.name = input.name;
			if (input.slug) setFields.slug = input.slug;
			if (input.settings) {
				for (const [key, value] of Object.entries(input.settings)) {
					if (value !== undefined) {
						setFields[`settings.${key}`] = value;
					}
				}
			}

			const org = await Organization.findOneAndUpdate(
				{ ownerId },
				{ $set: setFields, $setOnInsert: { ownerId, plan: "free" } },
				{ upsert: true, new: true },
			).lean();

			if (org) {
				await logAuditAction({
					orgId: String(org._id),
					userId: ctx.session.user.id,
					action: "organization.update",
					resource: String(org._id),
					metadata: input,
				});
			}

			return org;
		}),
});
