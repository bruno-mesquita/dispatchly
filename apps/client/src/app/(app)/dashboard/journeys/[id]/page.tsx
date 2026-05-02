"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import type { Connection, Node } from "@xyflow/react";
import {
	addEdge,
	Background,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import type { JourneyEdge, JourneyNode } from "@/hooks/use-journeys";
import {
	generateEdgeId,
	generateNodeId,
	useJourney,
} from "@/hooks/use-journeys";
import { ActionNode } from "./components/action-node";
import { BranchNode } from "./components/branch-node";
import { NodePalette } from "./components/node-palette";
import { TriggerNode } from "./components/trigger-node";
import { WaitNode } from "./components/wait-node";

const NODE_TYPES = {
	trigger: TriggerNode,
	action: ActionNode,
	wait: WaitNode,
	branch: BranchNode,
};

const STATUS_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	active: "default",
	draft: "outline",
	paused: "secondary",
	archived: "destructive",
};

const DEFAULT_NODE_DATA: Record<string, Record<string, unknown>> = {
	trigger: { event: "" },
	action: { channel: "email", template: "" },
	wait: { duration: 1, unit: "days" },
	branch: { condition: "" },
};

export default function JourneyEditorPage({
	params,
}: {
	params: { id: string };
}) {
	const { journey, updateFlow } = useJourney(params.id);
	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
		(journey?.nodes as Node[]) ?? [],
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState(journey?.edges ?? []);

	const onConnect = useCallback(
		(connection: Connection) =>
			setEdges((eds) => addEdge({ ...connection, id: generateEdgeId() }, eds)),
		[setEdges],
	);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const type = e.dataTransfer.getData("application/reactflow-nodetype");
			if (!type || !reactFlowWrapper.current) return;

			const bounds = reactFlowWrapper.current.getBoundingClientRect();
			const position = {
				x: e.clientX - bounds.left - 90,
				y: e.clientY - bounds.top - 30,
			};

			const newNode: Node = {
				id: generateNodeId(),
				type,
				position,
				data: { ...(DEFAULT_NODE_DATA[type] ?? {}) },
			};

			setNodes((nds) => [...nds, newNode]);
		},
		[setNodes],
	);

	function handleSave() {
		updateFlow(nodes as JourneyNode[], edges as JourneyEdge[]);
		toast.success("Journey saved");
	}

	if (!journey) {
		return (
			<div className="flex h-full items-center justify-center font-mono text-[12px] text-muted-foreground">
				Journey not found.{" "}
				<Link href="/dashboard/journeys" className="ml-2 underline">
					Back to list
				</Link>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Toolbar */}
			<div className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
				<div className="flex items-center gap-3">
					<Link
						href="/dashboard/journeys"
						className="font-mono text-[11px] text-muted-foreground opacity-60 transition-opacity hover:opacity-100"
					>
						← Journeys
					</Link>
					<span className="text-border opacity-50">/</span>
					<span className="font-medium font-mono text-[12px]">
						{journey.name}
					</span>
					<Badge
						variant={STATUS_VARIANT[journey.status] ?? "outline"}
						className="h-4 px-1.5 font-mono text-[9px] opacity-60"
					>
						{journey.status}
					</Badge>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-mono text-[10px] text-muted-foreground opacity-40">
						{nodes.length} steps · {edges.length} connections
					</span>
					<Button
						size="sm"
						onClick={handleSave}
						className="h-7 font-mono text-[10px] uppercase tracking-wider"
					>
						Save
					</Button>
				</div>
			</div>

			{/* Canvas area */}
			<div className="flex flex-1 overflow-hidden">
				<NodePalette />
				<div ref={reactFlowWrapper} className="flex-1">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onDragOver={onDragOver}
						onDrop={onDrop}
						nodeTypes={NODE_TYPES}
						fitView
						fitViewOptions={{ padding: 0.3 }}
						deleteKeyCode="Backspace"
						className="bg-muted/5"
					>
						<Background gap={20} size={1} className="opacity-30" />
						<Controls className="border-border bg-background shadow-none [&>button]:border-border [&>button]:bg-background" />
						<MiniMap
							className="!border-border !bg-background"
							nodeColor="#888"
							maskColor="rgba(0,0,0,0.05)"
						/>
					</ReactFlow>
				</div>
			</div>
		</div>
	);
}
