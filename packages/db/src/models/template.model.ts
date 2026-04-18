import mongoose from "mongoose";

const { Schema, model } = mongoose;

const templateSchema = new Schema(
	{
		orgId: { type: String, required: true },
		name: { type: String, required: true },
		type: {
			type: String,
			enum: ["email", "sms", "push"],
			required: true,
		},
		subject: { type: String },
		content: { type: String, required: true },
		variables: [{ type: String }],
		isActive: { type: Boolean, default: true },
	},
	{ collection: "template", timestamps: true },
);

templateSchema.index({ orgId: 1, type: 1 });

export const Template = model("Template", templateSchema);
