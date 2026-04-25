"use client";

import { useState } from "react";

export type OrgSettings = {
	name: string;
	slug: string;
	emailProvider: "resend" | "aws_ses" | "sendgrid";
	smsProvider: "twilio" | "vonage";
	timezone: string;
	webhookUrl: string;
	webhookSecret: string;
};

const MOCK_SETTINGS: OrgSettings = {
	name: "Minha Empresa",
	slug: "minha-empresa",
	emailProvider: "resend",
	smsProvider: "twilio",
	timezone: "America/Sao_Paulo",
	webhookUrl: "https://minha-empresa.com/webhooks/dispatchly",
	webhookSecret: "whsec_abc123xyz456",
};

// TODO: replace with trpc.organization.get.useQuery() + trpc.organization.update.useMutation()
export function useOrgSettings() {
	const [settings, setSettings] = useState<OrgSettings>(MOCK_SETTINGS);
	const [isSaving, setIsSaving] = useState(false);

	async function update(data: Partial<OrgSettings>) {
		setIsSaving(true);
		await new Promise((r) => setTimeout(r, 600));
		setSettings((prev) => ({ ...prev, ...data }));
		setIsSaving(false);
	}

	return {
		settings,
		update,
		isLoading: false as const,
		isSaving,
		error: null,
	};
}
