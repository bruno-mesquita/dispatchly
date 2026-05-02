"use client";

import type { BuilderAction, HeadingProps } from "@/types/email-builder";

interface Props {
	id: string;
	props: HeadingProps;
	dispatch: (a: BuilderAction) => void;
}

export function HeadingEditor({ id, props, dispatch }: Props) {
	const update = (patch: Partial<HeadingProps>) =>
		dispatch({ type: "UPDATE_BLOCK_PROPS", payload: { id, props: patch } });

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<label htmlFor={`${id}-text`} className="text-muted-foreground text-xs">
					Text
				</label>
				<input
					id={`${id}-text`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.text}
					onChange={(e) => update({ text: e.target.value })}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">Level</span>
				<div className="flex gap-2">
					{([1, 2, 3] as const).map((l) => (
						<button
							key={l}
							type="button"
							onClick={() => update({ level: l })}
							className={`flex h-8 w-8 items-center justify-center rounded-md border font-bold text-sm transition-colors ${props.level === l ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
						>
							H{l}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
