import {
	createTemplate,
	deleteTemplate,
	getTemplatesByOrg,
	updateTemplate,
} from "@dispatchly/templates";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";

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
			return createTemplate({
				...input,
				orgId: ctx.orgId,
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
