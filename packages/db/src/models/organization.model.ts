import mongoose from "mongoose";

const { Schema, model } = mongoose;

const organizationSchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		ownerId: { type: String, required: true },
		plan: {
			type: String,
			enum: ["free", "basic", "pro", "enterprise"],
			default: "free",
		},
		usage: {
			emails: { type: Number, default: 0 },
			sms: { type: Number, default: 0 },
			push: { type: Number, default: 0 },
		},
		lastResetAt: { type: Date },
		settings: {
			emailProvider: {
				type: String,
				enum: ["resend", "aws-ses", "sendgrid"],
				default: "resend",
			},
			smsProvider: { type: String, default: "twilio" },
			timezone: { type: String, default: "UTC" },
			webhookUrl: { type: String },
			webhookSecret: { type: String },
		},
	},
	{ collection: "organization", timestamps: true },
);

organizationSchema.index({ slug: 1 }, { unique: true });
organizationSchema.index({ ownerId: 1 });

export const Organization = model("Organization", organizationSchema);
