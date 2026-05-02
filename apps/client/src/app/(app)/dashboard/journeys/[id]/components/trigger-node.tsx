import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

type TriggerData = {
	event?: string;
};

export function TriggerNode({ data, selected }: NodeProps) {
	const d = data as TriggerData;

	return (
		<div
			className={`min-w-[180px] rounded-md border-2 bg-primary/10 px-4 py-3 shadow-sm transition-shadow ${
				selected ? "border-primary shadow-md" : "border-primary/40"
			}`}
		>
			<div className="mb-2 flex items-center gap-2">
				<span className="text-[11px] text-primary">◉</span>
				<span className="font-mono text-[9px] text-primary uppercase tracking-wider opacity-80">
					Trigger
				</span>
			</div>
			<input
				className="nodrag w-full rounded border border-primary/20 bg-background/60 px-2 py-1 font-mono text-[11px] text-foreground placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary/50"
				placeholder="event.name"
				defaultValue={d.event ?? ""}
				onChange={(e) => {
					(data as TriggerData).event = e.target.value;
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!h-2.5 !w-2.5 !border-2 !border-primary !bg-background"
			/>
		</div>
	);
}
