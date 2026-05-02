"use client";

import type { BuilderAction, ImageProps } from "@/types/email-builder";

interface Props {
	id: string;
	props: ImageProps;
	dispatch: (a: BuilderAction) => void;
}

export function ImageEditor({ id, props, dispatch }: Props) {
	const update = (patch: Partial<ImageProps>) =>
		dispatch({ type: "UPDATE_BLOCK_PROPS", payload: { id, props: patch } });

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<label htmlFor={`${id}-src`} className="text-muted-foreground text-xs">
					Image URL
				</label>
				<input
					id={`${id}-src`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.src}
					placeholder="https://..."
					onChange={(e) => update({ src: e.target.value })}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor={`${id}-alt`} className="text-muted-foreground text-xs">
					Alt text
				</label>
				<input
					id={`${id}-alt`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.alt}
					onChange={(e) => update({ alt: e.target.value })}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label
					htmlFor={`${id}-width`}
					className="text-muted-foreground text-xs"
				>
					Width (px)
				</label>
				<input
					type="number"
					id={`${id}-width`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.width}
					onChange={(e) => update({ width: Number(e.target.value) })}
				/>
			</div>
		</div>
	);
}
