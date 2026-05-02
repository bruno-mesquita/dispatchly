import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

type ActionData = {
	channel?: "email" | "sms" | "push";
	template?: string;
};

const CHANNEL_ICON: Record<string, string> = {
	email: "✉",
	sms: "□",
	push: "◎",
};

export function ActionNode({ data, selected }: NodeProps) {
	const d = data as ActionData;
	const [channel, setChannel] = useState<string>(d.channel ?? "email");
	const [template, setTemplate] = useState<string>(d.template ?? "");

	function handleChannelChange(v: string) {
		setChannel(v);
		(data as ActionData).channel = v as ActionData["channel"];
	}

	function handleTemplateChange(v: string) {
		setTemplate(v);
		(data as ActionData).template = v;
	}

	return (
		<div
			className={`min-w-[200px] rounded-md border bg-background px-4 py-3 shadow-sm transition-shadow ${
				selected ? "border-foreground/40 shadow-md" : "border-border"
			}`}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="!h-2.5 !w-2.5 !border-2 !border-border !bg-background"
			/>
			<div className="mb-2 flex items-center gap-2">
				<span className="text-[11px] opacity-60">{CHANNEL_ICON[channel]}</span>
				<span className="font-mono text-[9px] uppercase tracking-wider opacity-50">
					Send
				</span>
			</div>
			<div className="space-y-2">
				<select
					className="nodrag w-full rounded border border-border bg-muted/30 px-2 py-1 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
					value={channel}
					onChange={(e) => handleChannelChange(e.target.value)}
				>
					<option value="email">Email</option>
					<option value="sms">SMS</option>
					<option value="push">Push</option>
				</select>
				<input
					className="nodrag w-full rounded border border-border bg-muted/30 px-2 py-1 font-mono text-[11px] placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-ring"
					placeholder="template name"
					value={template}
					onChange={(e) => handleTemplateChange(e.target.value)}
				/>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!h-2.5 !w-2.5 !border-2 !border-border !bg-background"
			/>
		</div>
	);
}
