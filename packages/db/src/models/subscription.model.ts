import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
	{
		orgId: { type: String, required: true, unique: true },
		stripeCustomerId: { type: String },
		stripeSubscriptionId: { type: String },
		plan: { type: String, default: "free" },
		status: {
			type: String,
			enum: ["active", "past_due", "canceled", "trialing"],
			default: "active",
		},
		currentPeriodStart: { type: Date },
		currentPeriodEnd: { type: Date },
	},
	{ collection: "subscription", timestamps: true },
);

subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

export const Subscription = model("Subscription", subscriptionSchema);
