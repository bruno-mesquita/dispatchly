import { Template } from "@dispatchly/db";
import type { NotificationType } from "@dispatchly/notifications";

export interface CreateTemplateInput {
	orgId: string;
	name: string;
	type: NotificationType;
	subject?: string;
	content: string;
	variables?: string[];
}

export async function createTemplate(input: CreateTemplateInput) {
	const template = new Template({
		orgId: input.orgId,
		name: input.name,
		type: input.type,
		subject: input.subject,
		content: input.content,
		variables: input.variables || [],
		isActive: true,
	});

	return template.save();
}

export async function getTemplatesByOrg(
	orgId: string,
	type?: NotificationType,
) {
	const query: Record<string, string> = { orgId };
	if (type) query.type = type;

	return Template.find(query).sort({ createdAt: -1 });
}

export async function getTemplateById(id: string) {
	return Template.findById(id);
}

export async function updateTemplate(
	id: string,
	data: Partial<CreateTemplateInput>,
) {
	return Template.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteTemplate(id: string) {
	return Template.findByIdAndDelete(id);
}

export async function applyTemplate(
	templateId: string,
	variables: Record<string, unknown>,
): Promise<{ subject?: string; content: string }> {
	const template = await Template.findById(templateId);
	if (!template) throw new Error("Template not found");

	let content = template.content;
	let subject = template.subject || "";

	if (template.variables) {
		for (const variable of template.variables) {
			const value = variables[variable] ?? `{{${variable}}}`;
			content = content.replace(
				new RegExp(`{{${variable}}`, "g"),
				String(value),
			);
			subject = subject.replace(
				new RegExp(`{{${variable}}`, "g"),
				String(value),
			);
		}
	}

	return { subject, content };
}
