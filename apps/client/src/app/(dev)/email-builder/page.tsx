"use client";

import { toast } from "sonner";
import { EmailBuilderShell } from "@/components/email-builder/email-builder-shell";
import type { EmailDocument } from "@/types/email-builder";

export default function EmailBuilderDevPage() {
	function handleSave(doc: EmailDocument, html: string, variables: string[]) {
		console.log("[email-builder] save", { doc, html, variables });
		toast.success("Saved to console (dev mode)");
	}

	return <EmailBuilderShell onSave={handleSave} />;
}
