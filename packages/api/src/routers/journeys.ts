import { Journey } from "@dispatchly/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { logAuditAction } from "../services/audit.js";

const nodeSchema = z.object({
	id: z.string(),
	type: z.string(),
	position: z.object({ x: z.number(), y: z.number() }),
	data: z.record(z.string(), z.unknown()),
});

const edgeSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
	sourceHandle: z.string().nullable().optional(),
	targetHandle: z.string().nullable().optional(),
});

export const journeysRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		const journeys = await Journey.find({ orgId: ctx.orgId })
			.select("_id name description status nodes createdAt")
			.sort({ createdAt: -1 })
			.lean();
		return journeys.map((j) => ({
			id: String(j._id),
			name: j.name,
			description: j.description,
			status: j.status,
			nodeCount: Array.isArray(j.nodes) ? j.nodes.length : 0,
			createdAt: j.createdAt,
		}));
	}),

	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const journey = await Journey.findOne({
				_id: input.id,
				orgId: ctx.orgId,
			}).lean();
			if (!journey) return null;
			return {
				id: String(journey._id),
				name: journey.name,
				description: journey.description,
				status: journey.status,
				nodes: journey.nodes ?? [],
				edges: journey.edges ?? [],
				createdAt: journey.createdAt,
				updatedAt: journey.updatedAt,
			};
		}),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const journey = await Journey.create({
				orgId: ctx.orgId,
				name: input.name,
				description: input.description,
				status: "draft",
				nodes: [],
				edges: [],
			});

			await logAuditAction({
				orgId: ctx.orgId,
				userId: ctx.session.user.id,
				action: "journey.create",
				resource: String(journey._id),
				metadata: { name: journey.name },
			});

			return { id: String(journey._id), name: journey.name };
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				description: z.string().optional(),
				status: z.enum(["draft", "active", "paused", "archived"]).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, ...data } = input;
			const journey = await Journey.findOneAndUpdate(
				{ _id: id, orgId: ctx.orgId },
				data,
				{ new: true },
			).lean();

			if (journey) {
				await logAuditAction({
					orgId: ctx.orgId,
					userId: ctx.session.user.id,
					action: "journey.update",
					resource: id,
					metadata: data,
				});
			}

			return journey;
		}),

	updateFlow: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				nodes: z.array(nodeSchema),
				edges: z.array(edgeSchema),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const journey = await Journey.findOneAndUpdate(
				{ _id: input.id, orgId: ctx.orgId },
				{ nodes: input.nodes, edges: input.edges },
				{ new: true },
			).lean();
			return journey ? { id: String(journey._id) } : null;
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			await Journey.deleteOne({ _id: input.id, orgId: ctx.orgId });

			await logAuditAction({
				orgId: ctx.orgId,
				userId: ctx.session.user.id,
				action: "journey.delete",
				resource: input.id,
			});

			return { success: true };
		}),
});
