import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationLogSchema = new Schema(
	{
		orgId: { type: String, required: true },
		type: {
			type: String,
			enum: ["email", "sms", "push"],
			required: true,
		},
		provider: { type: String, required: true },
		to: { type: String, required: true },
		templateId: { type: String },
		messageId: { type: String },
		subject: { type: String },
		content: { type: String },
		status: {
			type: String,
			enum: ["pending", "sent", "delivered", "failed", "bounced"],
			default: "pending",
		},
		error: { type: String },
		metadata: { type: Schema.Types.Mixed },
		sentAt: { type: Date },
		deliveredAt: { type: Date },
	},
	{ collection: "notification_log", timestamps: true },
);

notificationLogSchema.index({ orgId: 1, createdAt: -1 });
notificationLogSchema.index({ status: 1 });
notificationLogSchema.index({ type: 1 });
notificationLogSchema.index({ to: 1 });

export const NotificationLog = model("NotificationLog", notificationLogSchema);
