"use client";

import type { BuilderAction, TextProps } from "@/types/email-builder";

interface Props {
	id: string;
	props: TextProps;
	dispatch: (a: BuilderAction) => void;
}

export function TextEditor({ id, props, dispatch }: Props) {
	return (
		<div className="flex flex-col gap-1">
			<label
				htmlFor={`${id}-content`}
				className="text-muted-foreground text-xs"
			>
				Content
			</label>
			<textarea
				id={`${id}-content`}
				rows={6}
				className="resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				value={props.content}
				onChange={(e) =>
					dispatch({
						type: "UPDATE_BLOCK_PROPS",
						payload: { id, props: { content: e.target.value } },
					})
				}
			/>
			<p className="text-muted-foreground text-xs">
				Use{" "}
				<code className="rounded bg-muted px-1 font-mono">{"{{name}}"}</code> to
				insert variables.
			</p>
		</div>
	);
}
