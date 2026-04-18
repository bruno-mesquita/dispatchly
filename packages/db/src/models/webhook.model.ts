import mongoose from "mongoose";

const { Schema, model } = mongoose;

const webhookSchema = new Schema(
	{
		orgId: { type: String, required: true },
		name: { type: String, required: true },
		url: { type: String, required: true },
		secret: { type: String },
		events: [{ type: String }],
		isActive: { type: Boolean, default: true },
		lastTriggeredAt: { type: Date },
	},
	{ collection: "webhook", timestamps: true },
);

webhookSchema.index({ orgId: 1 });

export const Webhook = model("Webhook", webhookSchema);
