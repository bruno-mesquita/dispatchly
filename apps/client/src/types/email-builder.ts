export type BlockType =
	| "heading"
	| "text"
	| "button"
	| "image"
	| "divider"
	| "spacer";

export interface HeadingProps {
	text: string;
	level: 1 | 2 | 3;
}
export interface TextProps {
	content: string;
}
export interface ButtonProps {
	label: string;
	href: string;
	align: "left" | "center" | "right";
	backgroundColor: string;
	color: string;
}
export interface ImageProps {
	src: string;
	alt: string;
	width: number;
}
export interface DividerProps {
	color: string;
}
export interface SpacerProps {
	height: number;
}

export type BlockProps =
	| HeadingProps
	| TextProps
	| ButtonProps
	| ImageProps
	| DividerProps
	| SpacerProps;

export interface EmailBlock {
	id: string;
	type: BlockType;
	props: BlockProps;
}

export interface EmailDocument {
	subject: string;
	previewText: string;
	blocks: EmailBlock[];
}

export interface VariableMap {
	[name: string]: string;
}

export interface EmailBuilderProps {
	initialData?: EmailDocument;
	onSave: (
		doc: EmailDocument,
		renderedHtml: string,
		variables: string[],
	) => void | Promise<void>;
	onLoad?: () => Promise<EmailDocument | null>;
	isSaving?: boolean;
}

export type BuilderAction =
	| { type: "ADD_BLOCK"; payload: { blockType: BlockType; index?: number } }
	| { type: "REMOVE_BLOCK"; payload: { id: string } }
	| { type: "REORDER_BLOCKS"; payload: { oldIndex: number; newIndex: number } }
	| {
			type: "UPDATE_BLOCK_PROPS";
			payload: { id: string; props: Partial<BlockProps> };
	  }
	| { type: "SET_SUBJECT"; payload: string }
	| { type: "SET_PREVIEW_TEXT"; payload: string };
