import mongoose from "mongoose";

const { Schema, model } = mongoose;

const auditLogSchema = new Schema(
	{
		orgId: { type: String, required: true },
		userId: { type: String, required: true },
		action: { type: String, required: true },
		resource: { type: String },
		metadata: { type: Schema.Types.Mixed },
	},
	{ collection: "audit_log", timestamps: true },
);

auditLogSchema.index({ orgId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = model("AuditLog", auditLogSchema);
