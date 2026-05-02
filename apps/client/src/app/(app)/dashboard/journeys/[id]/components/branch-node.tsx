import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

type BranchData = {
	condition?: string;
};

export function BranchNode({ data, selected }: NodeProps) {
	const d = data as BranchData;
	const [condition, setCondition] = useState<string>(d.condition ?? "");

	function handleChange(v: string) {
		setCondition(v);
		(data as BranchData).condition = v;
	}

	return (
		<div
			className={`min-w-[200px] rounded-md border bg-amber-50/5 px-4 py-3 shadow-sm transition-shadow ${
				selected ? "border-amber-400/60 shadow-md" : "border-amber-500/30"
			}`}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="!h-2.5 !w-2.5 !border-2 !border-amber-500/50 !bg-background"
			/>
			<div className="mb-2 flex items-center gap-2">
				<span className="text-[11px] text-amber-500/70">⑂</span>
				<span className="font-mono text-[9px] text-amber-600/70 uppercase tracking-wider">
					Branch
				</span>
			</div>
			<input
				className="nodrag w-full rounded border border-amber-500/20 bg-background/60 px-2 py-1 font-mono text-[11px] placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
				placeholder="condition"
				value={condition}
				onChange={(e) => handleChange(e.target.value)}
			/>
			<div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground opacity-50">
				<span>yes</span>
				<span>no</span>
			</div>
			<Handle
				id="yes"
				type="source"
				position={Position.Bottom}
				style={{ left: "30%" }}
				className="!h-2.5 !w-2.5 !border-2 !border-amber-500/50 !bg-background"
			/>
			<Handle
				id="no"
				type="source"
				position={Position.Bottom}
				style={{ left: "70%" }}
				className="!h-2.5 !w-2.5 !border-2 !border-amber-500/50 !bg-background"
			/>
		</div>
	);
}
