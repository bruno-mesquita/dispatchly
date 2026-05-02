"use client";

import { useState } from "react";
import {
	Panel,
	Group as PanelGroup,
	Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { useEmailBuilder } from "@/hooks/use-email-builder";
import { useEmailRenderer } from "@/hooks/use-email-renderer";
import { useVariableExtractor } from "@/hooks/use-variable-extractor";
import type { EmailBuilderProps, VariableMap } from "@/types/email-builder";
import { BlockCanvas } from "./block-canvas";
import { BlockPaletteDropdown } from "./block-palette-dropdown";
import { BlockPropsPanel } from "./block-props-panel";
import { LivePreview } from "./live-preview";
import { Toolbar } from "./toolbar";
import { VariablePanel } from "./variable-panel";

export function EmailBuilderShell({
	initialData,
	onSave,
	isSaving,
}: EmailBuilderProps) {
	const [doc, dispatch] = useEmailBuilder(initialData);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [variableMap, setVariableMap] = useState<VariableMap>({});

	const variables = useVariableExtractor(doc.blocks);
	const html = useEmailRenderer(doc.blocks, variableMap);

	const selectedBlock = doc.blocks.find((b) => b.id === selectedId) ?? null;

	function handleVariableChange(name: string, value: string) {
		setVariableMap((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSave() {
		await onSave(doc, html, variables);
	}

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<Toolbar
				subject={doc.subject}
				previewText={doc.previewText}
				isSaving={isSaving}
				dispatch={dispatch}
				onSave={handleSave}
			/>

			<PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
				{/* Left pane: canvas + optional props panel */}
				<Panel defaultSize={50} minSize={30}>
					<div className="flex h-full flex-col overflow-hidden">
						{selectedBlock ? (
							<BlockPropsPanel
								block={selectedBlock}
								dispatch={dispatch}
								onClose={() => setSelectedId(null)}
								variables={variables}
								variableMap={variableMap}
								onVariableChange={handleVariableChange}
							/>
						) : (
							<>
								<div className="flex-1 overflow-y-auto">
									<BlockCanvas
										blocks={doc.blocks}
										selectedId={selectedId}
										vars={variableMap}
										dispatch={dispatch}
										onSelect={(id) => setSelectedId(id)}
									/>
								</div>
								<div className="border-t bg-background p-3">
									<div className="flex items-center justify-between">
										<BlockPaletteDropdown dispatch={dispatch} />
										{variables.length > 0 && (
											<span className="text-muted-foreground text-xs">
												{variables.length} variable
												{variables.length !== 1 ? "s" : ""} detected
											</span>
										)}
									</div>
									{variables.length > 0 && (
										<div className="mt-3 border-t pt-3">
											<p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
												Test Variables
											</p>
											<VariablePanel
												variables={variables}
												variableMap={variableMap}
												onChange={handleVariableChange}
											/>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</Panel>

				<PanelResizeHandle className="w-1.5 bg-border transition-colors hover:bg-primary/40 active:bg-primary/60" />

				{/* Right pane: live preview */}
				<Panel defaultSize={50} minSize={25}>
					<div className="flex h-full flex-col overflow-hidden">
						<div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2">
							<span className="font-mono text-muted-foreground text-xs">
								Preview
							</span>
							<span className="font-mono text-muted-foreground text-xs opacity-50">
								{doc.blocks.length} block{doc.blocks.length !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="flex-1 overflow-hidden">
							<LivePreview html={html} />
						</div>
					</div>
				</Panel>
			</PanelGroup>
		</div>
	);
}
