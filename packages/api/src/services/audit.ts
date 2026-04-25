import { AuditLog } from "@dispatchly/db";

interface AuditLogOptions {
	orgId: string;
	userId: string;
	action: string;
	resource?: string;
	metadata?: Record<string, unknown>;
}

/**
 * Log an action to the audit log.
 */
export async function logAuditAction(options: AuditLogOptions) {
	try {
		await AuditLog.create({
			orgId: options.orgId,
			userId: options.userId,
			action: options.action,
			resource: options.resource,
			metadata: options.metadata,
		});
	} catch (error) {
		// We don't want to fail the main operation if audit logging fails
		console.error("Failed to log audit action:", error);
	}
}
