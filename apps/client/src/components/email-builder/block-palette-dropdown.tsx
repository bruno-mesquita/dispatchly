"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BlockType, BuilderAction } from "@/types/email-builder";
import { BLOCK_LABELS } from "./block-renderer";

const BLOCK_ICONS: Record<BlockType, string> = {
	heading: "H",
	text: "¶",
	button: "□",
	image: "⬜",
	divider: "—",
	spacer: "↕",
};

const BLOCKS: BlockType[] = [
	"heading",
	"text",
	"button",
	"image",
	"divider",
	"spacer",
];

interface Props {
	dispatch: (a: BuilderAction) => void;
}

export function BlockPaletteDropdown({ dispatch }: Props) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function onClickOutside(e: MouseEvent) {
			if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [open]);

	function add(type: BlockType) {
		dispatch({ type: "ADD_BLOCK", payload: { blockType: type } });
		setOpen(false);
	}

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-medium text-sm transition-colors hover:bg-accent"
			>
				<Plus size={14} />
				Add Block
			</button>
			{open && (
				<div className="absolute bottom-full left-0 z-20 mb-1 w-44 rounded-lg border border-border bg-popover shadow-lg">
					{BLOCKS.map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => add(type)}
							className="flex w-full items-center gap-3 px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-accent"
						>
							<span className="w-4 text-center font-mono text-muted-foreground text-xs">
								{BLOCK_ICONS[type]}
							</span>
							{BLOCK_LABELS[type]}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
