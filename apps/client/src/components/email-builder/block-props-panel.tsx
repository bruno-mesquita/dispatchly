"use client";

import { X } from "lucide-react";
import type {
	BuilderAction,
	ButtonProps,
	EmailBlock,
	HeadingProps,
	ImageProps,
	SpacerProps,
	TextProps,
	VariableMap,
} from "@/types/email-builder";
import { ButtonEditor } from "./block-editors/button-editor";
import { HeadingEditor } from "./block-editors/heading-editor";
import { ImageEditor } from "./block-editors/image-editor";
import { SpacerEditor } from "./block-editors/spacer-editor";
import { TextEditor } from "./block-editors/text-editor";
import { BLOCK_LABELS } from "./block-renderer";
import { VariablePanel } from "./variable-panel";

interface Props {
	block: EmailBlock;
	dispatch: (a: BuilderAction) => void;
	onClose: () => void;
	variables: string[];
	variableMap: VariableMap;
	onVariableChange: (name: string, value: string) => void;
}

export function BlockPropsPanel({
	block,
	dispatch,
	onClose,
	variables,
	variableMap,
	onVariableChange,
}: Props) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b px-4 py-3">
				<span className="font-medium text-sm">
					{BLOCK_LABELS[block.type]} Properties
				</span>
				<button
					type="button"
					onClick={onClose}
					className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
				>
					<X size={14} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex flex-col gap-4">
					{block.type === "heading" && (
						<HeadingEditor
							id={block.id}
							props={block.props as HeadingProps}
							dispatch={dispatch}
						/>
					)}
					{block.type === "text" && (
						<TextEditor
							id={block.id}
							props={block.props as TextProps}
							dispatch={dispatch}
						/>
					)}
					{block.type === "button" && (
						<ButtonEditor
							id={block.id}
							props={block.props as ButtonProps}
							dispatch={dispatch}
						/>
					)}
					{block.type === "image" && (
						<ImageEditor
							id={block.id}
							props={block.props as ImageProps}
							dispatch={dispatch}
						/>
					)}
					{block.type === "spacer" && (
						<SpacerEditor
							id={block.id}
							props={block.props as SpacerProps}
							dispatch={dispatch}
						/>
					)}

					{variables.length > 0 && (
						<div className="border-t pt-4">
							<p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
								Test Variables
							</p>
							<VariablePanel
								variables={variables}
								variableMap={variableMap}
								onChange={onVariableChange}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
