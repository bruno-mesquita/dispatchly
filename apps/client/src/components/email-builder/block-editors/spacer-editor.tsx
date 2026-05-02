"use client";

import type { BuilderAction, SpacerProps } from "@/types/email-builder";

interface Props {
	id: string;
	props: SpacerProps;
	dispatch: (a: BuilderAction) => void;
}

export function SpacerEditor({ id, props, dispatch }: Props) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={`${id}-height`} className="text-muted-foreground text-xs">
				Height (px)
			</label>
			<input
				type="range"
				id={`${id}-height`}
				min={4}
				max={128}
				step={4}
				value={props.height}
				onChange={(e) =>
					dispatch({
						type: "UPDATE_BLOCK_PROPS",
						payload: { id, props: { height: Number(e.target.value) } },
					})
				}
				className="w-full"
			/>
			<span className="text-muted-foreground text-xs">{props.height}px</span>
		</div>
	);
}
