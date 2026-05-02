type PaletteItem = {
	type: string;
	label: string;
	icon: string;
	description: string;
};

const PALETTE_ITEMS: PaletteItem[] = [
	{ type: "trigger", label: "Trigger", icon: "◉", description: "Entry event" },
	{
		type: "action",
		label: "Send",
		icon: "→",
		description: "Email / SMS / Push",
	},
	{ type: "wait", label: "Wait", icon: "◷", description: "Delay step" },
	{ type: "branch", label: "Branch", icon: "⑂", description: "Condition fork" },
];

export function NodePalette() {
	function onDragStart(e: React.DragEvent, type: string) {
		e.dataTransfer.setData("application/reactflow-nodetype", type);
		e.dataTransfer.effectAllowed = "move";
	}

	return (
		<aside className="flex w-48 shrink-0 flex-col gap-1 border-r bg-muted/10 p-3">
			<p className="mb-3 px-1 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.12em] opacity-50">
				Node Types
			</p>
			{PALETTE_ITEMS.map((item) => (
				<button
					key={item.type}
					type="button"
					draggable
					onDragStart={(e) => onDragStart(e, item.type)}
					className="flex w-full cursor-grab items-center gap-3 rounded-md border border-border/50 bg-background px-3 py-2.5 shadow-none transition-colors hover:border-border hover:bg-accent active:cursor-grabbing"
				>
					<span className="text-[13px] opacity-60">{item.icon}</span>
					<div>
						<p className="font-medium font-mono text-[11px]">{item.label}</p>
						<p className="font-mono text-[9px] text-muted-foreground opacity-60">
							{item.description}
						</p>
					</div>
				</button>
			))}
			<div className="mt-auto pt-4 font-mono text-[9px] text-muted-foreground opacity-40">
				Drag onto canvas
			</div>
		</aside>
	);
}
