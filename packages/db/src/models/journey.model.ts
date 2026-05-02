import mongoose from "mongoose";

const { Schema, model } = mongoose;

const journeySchema = new Schema(
	{
		orgId: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String },
		status: {
			type: String,
			enum: ["draft", "active", "paused", "archived"],
			default: "draft",
		},
		nodes: { type: Schema.Types.Mixed, default: [] },
		edges: { type: Schema.Types.Mixed, default: [] },
	},
	{ collection: "journey", timestamps: true },
);

journeySchema.index({ orgId: 1, createdAt: -1 });

export const Journey = model("Journey", journeySchema);
