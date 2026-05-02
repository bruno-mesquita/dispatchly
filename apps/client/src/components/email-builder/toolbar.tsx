"use client";

import { Save } from "lucide-react";
import type { BuilderAction } from "@/types/email-builder";

interface Props {
	subject: string;
	previewText: string;
	isSaving?: boolean;
	dispatch: (a: BuilderAction) => void;
	onSave: () => void;
}

export function Toolbar({
	subject,
	previewText,
	isSaving,
	dispatch,
	onSave,
}: Props) {
	return (
		<div className="flex items-center gap-3 border-b bg-background px-4 py-2.5">
			<div className="flex flex-1 items-center gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<label
						htmlFor="email-subject"
						className="shrink-0 text-muted-foreground text-xs"
					>
						Subject:
					</label>
					<input
						id="email-subject"
						value={subject}
						onChange={(e) =>
							dispatch({ type: "SET_SUBJECT", payload: e.target.value })
						}
						className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-2 py-1 text-sm outline-none hover:border-border focus:border-input focus:ring-1 focus:ring-ring"
						placeholder="Email subject..."
					/>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<label
						htmlFor="email-preview-text"
						className="shrink-0 text-muted-foreground text-xs"
					>
						Preview:
					</label>
					<input
						id="email-preview-text"
						value={previewText}
						onChange={(e) =>
							dispatch({ type: "SET_PREVIEW_TEXT", payload: e.target.value })
						}
						className="w-48 rounded border border-transparent bg-transparent px-2 py-1 text-sm outline-none hover:border-border focus:border-input focus:ring-1 focus:ring-ring"
						placeholder="Preview text..."
					/>
				</div>
			</div>
			<button
				type="button"
				onClick={onSave}
				disabled={isSaving}
				className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				<Save size={14} />
				{isSaving ? "Saving..." : "Save"}
			</button>
		</div>
	);
}
