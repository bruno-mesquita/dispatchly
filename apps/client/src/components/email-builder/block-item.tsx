"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type {
	BuilderAction,
	EmailBlock,
	VariableMap,
} from "@/types/email-builder";
import { BLOCK_LABELS, BlockPreview } from "./block-renderer";

interface Props {
	block: EmailBlock;
	isSelected: boolean;
	vars: VariableMap;
	onSelect: () => void;
	dispatch: (a: BuilderAction) => void;
}

export function BlockItem({
	block,
	isSelected,
	vars,
	onSelect,
	dispatch,
}: Props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: block.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`group relative rounded-lg border bg-card transition-colors ${
				isSelected
					? "border-primary ring-2 ring-primary/20"
					: "border-border hover:border-muted-foreground/40"
			}`}
		>
			<div className="flex items-start gap-2 p-3">
				<button
					type="button"
					{...attributes}
					{...listeners}
					onClick={(e) => e.stopPropagation()}
					className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
					aria-label="Drag to reorder"
				>
					<GripVertical size={14} />
				</button>
				<button
					type="button"
					onClick={onSelect}
					className="min-w-0 flex-1 text-left"
				>
					<p className="mb-1 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
						{BLOCK_LABELS[block.type]}
					</p>
					<BlockPreview block={block} vars={vars} />
				</button>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						dispatch({ type: "REMOVE_BLOCK", payload: { id: block.id } });
					}}
					aria-label="Remove block"
					className="shrink-0 rounded p-0.5 text-muted-foreground/0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:text-muted-foreground/40"
				>
					<Trash2 size={12} />
				</button>
			</div>
		</div>
	);
}
