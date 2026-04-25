import {
	createTemplate,
	deleteTemplate,
	getTemplatesByOrg,
	updateTemplate,
} from "@dispatchly/templates";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { logAuditAction } from "../services/audit.js";

export const templatesRouter = router({
	list: protectedProcedure
		.input(
			z.object({
				type: z.enum(["email", "sms", "push"]).optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return getTemplatesByOrg(ctx.orgId, input.type);
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
			const template = await createTemplate({
				...input,
				orgId: ctx.orgId,
			});

			await logAuditAction({
				orgId: ctx.orgId,
				userId: ctx.session.user.id,
				action: "template.create",
				resource: String(template._id),
				metadata: { name: template.name, type: template.type },
			});

			return template;
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
		.mutation(async ({ input, ctx }) => {
			const { id, ...data } = input;
			const template = await updateTemplate(id, data);

			if (template) {
				await logAuditAction({
					orgId: ctx.orgId,
					userId: ctx.session.user.id,
					action: "template.update",
					resource: id,
					metadata: data,
				});
			}

			return template;
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const result = await deleteTemplate(input.id);

			await logAuditAction({
				orgId: ctx.orgId,
				userId: ctx.session.user.id,
				action: "template.delete",
				resource: input.id,
			});

			return result;
		}),
});
