import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

type WaitData = {
	duration?: number;
	unit?: "hours" | "days";
};

export function WaitNode({ data, selected }: NodeProps) {
	const d = data as WaitData;
	const [duration, setDuration] = useState<number>(d.duration ?? 1);
	const [unit, setUnit] = useState<string>(d.unit ?? "days");

	function handleDurationChange(v: number) {
		setDuration(v);
		(data as WaitData).duration = v;
	}

	function handleUnitChange(v: string) {
		setUnit(v);
		(data as WaitData).unit = v as WaitData["unit"];
	}

	return (
		<div
			className={`min-w-[180px] rounded-md border border-dashed bg-muted/30 px-4 py-3 shadow-sm transition-shadow ${
				selected ? "border-foreground/50 shadow-md" : "border-border"
			}`}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="!h-2.5 !w-2.5 !border-2 !border-border !bg-background"
			/>
			<div className="mb-2 flex items-center gap-2">
				<span className="text-[11px] opacity-60">◷</span>
				<span className="font-mono text-[9px] uppercase tracking-wider opacity-50">
					Wait
				</span>
			</div>
			<div className="flex gap-2">
				<input
					type="number"
					min={1}
					className="nodrag w-16 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
					value={duration}
					onChange={(e) => handleDurationChange(Number(e.target.value))}
				/>
				<select
					className="nodrag flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
					value={unit}
					onChange={(e) => handleUnitChange(e.target.value)}
				>
					<option value="hours">hours</option>
					<option value="days">days</option>
				</select>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!h-2.5 !w-2.5 !border-2 !border-border !bg-background"
			/>
		</div>
	);
}
