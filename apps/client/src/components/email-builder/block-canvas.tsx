"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
	BuilderAction,
	EmailBlock,
	VariableMap,
} from "@/types/email-builder";
import { BlockItem } from "./block-item";

interface Props {
	blocks: EmailBlock[];
	selectedId: string | null;
	vars: VariableMap;
	dispatch: (a: BuilderAction) => void;
	onSelect: (id: string) => void;
}

export function BlockCanvas({
	blocks,
	selectedId,
	vars,
	dispatch,
	onSelect,
}: Props) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = blocks.findIndex((b) => b.id === active.id);
		const newIndex = blocks.findIndex((b) => b.id === over.id);
		dispatch({ type: "REORDER_BLOCKS", payload: { oldIndex, newIndex } });
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={blocks.map((b) => b.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2 p-4">
					{blocks.length === 0 && (
						<div className="flex h-32 items-center justify-center rounded-lg border border-border border-dashed text-muted-foreground text-sm">
							No blocks yet. Use "Add Block" to start.
						</div>
					)}
					{blocks.map((block) => (
						<BlockItem
							key={block.id}
							block={block}
							isSelected={selectedId === block.id}
							vars={vars}
							onSelect={() => onSelect(block.id)}
							dispatch={dispatch}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
