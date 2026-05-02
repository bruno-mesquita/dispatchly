"use client";

import type { BuilderAction, ButtonProps } from "@/types/email-builder";

interface Props {
	id: string;
	props: ButtonProps;
	dispatch: (a: BuilderAction) => void;
}

export function ButtonEditor({ id, props, dispatch }: Props) {
	const update = (patch: Partial<ButtonProps>) =>
		dispatch({ type: "UPDATE_BLOCK_PROPS", payload: { id, props: patch } });

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<label
					htmlFor={`${id}-label`}
					className="text-muted-foreground text-xs"
				>
					Label
				</label>
				<input
					id={`${id}-label`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.label}
					onChange={(e) => update({ label: e.target.value })}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor={`${id}-href`} className="text-muted-foreground text-xs">
					URL
				</label>
				<input
					id={`${id}-href`}
					className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					value={props.href}
					onChange={(e) => update({ href: e.target.value })}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-muted-foreground text-xs">Alignment</span>
				<div className="flex gap-2">
					{(["left", "center", "right"] as const).map((a) => (
						<button
							key={a}
							type="button"
							onClick={() => update({ align: a })}
							className={`flex-1 rounded-md border py-1.5 font-medium text-xs capitalize transition-colors ${props.align === a ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
						>
							{a}
						</button>
					))}
				</div>
			</div>
			<div className="flex gap-3">
				<div className="flex flex-1 flex-col gap-1">
					<label htmlFor={`${id}-bg`} className="text-muted-foreground text-xs">
						Background
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							id={`${id}-bg`}
							value={props.backgroundColor}
							onChange={(e) => update({ backgroundColor: e.target.value })}
							className="h-8 w-8 cursor-pointer rounded border border-border"
						/>
						<span className="font-mono text-muted-foreground text-xs">
							{props.backgroundColor}
						</span>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<label
						htmlFor={`${id}-color`}
						className="text-muted-foreground text-xs"
					>
						Text color
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							id={`${id}-color`}
							value={props.color}
							onChange={(e) => update({ color: e.target.value })}
							className="h-8 w-8 cursor-pointer rounded border border-border"
						/>
						<span className="font-mono text-muted-foreground text-xs">
							{props.color}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
