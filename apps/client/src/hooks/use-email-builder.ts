"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { useReducer } from "react";
import type {
	BlockType,
	BuilderAction,
	EmailDocument,
} from "@/types/email-builder";

function defaultProps(type: BlockType) {
	switch (type) {
		case "heading":
			return { text: "Your Heading", level: 1 as const };
		case "text":
			return { content: "Write your message here. Use {{variable}} syntax." };
		case "button":
			return {
				label: "Click Here",
				href: "https://",
				align: "center" as const,
				backgroundColor: "#000000",
				color: "#ffffff",
			};
		case "image":
			return { src: "", alt: "Image", width: 600 };
		case "divider":
			return { color: "#e5e7eb" };
		case "spacer":
			return { height: 24 };
	}
}

function reducer(state: EmailDocument, action: BuilderAction): EmailDocument {
	switch (action.type) {
		case "ADD_BLOCK": {
			const newBlock = {
				id: crypto.randomUUID(),
				type: action.payload.blockType,
				props: defaultProps(action.payload.blockType),
			};
			const idx = action.payload.index ?? state.blocks.length;
			const blocks = [...state.blocks];
			blocks.splice(idx, 0, newBlock);
			return { ...state, blocks };
		}
		case "REMOVE_BLOCK":
			return {
				...state,
				blocks: state.blocks.filter((b) => b.id !== action.payload.id),
			};
		case "REORDER_BLOCKS":
			return {
				...state,
				blocks: arrayMove(
					state.blocks,
					action.payload.oldIndex,
					action.payload.newIndex,
				),
			};
		case "UPDATE_BLOCK_PROPS":
			return {
				...state,
				blocks: state.blocks.map((b) =>
					b.id === action.payload.id
						? { ...b, props: { ...b.props, ...action.payload.props } }
						: b,
				),
			};
		case "SET_SUBJECT":
			return { ...state, subject: action.payload };
		case "SET_PREVIEW_TEXT":
			return { ...state, previewText: action.payload };
		default:
			return state;
	}
}

const DEFAULT_DOCUMENT: EmailDocument = {
	subject: "Hello {{firstName}}!",
	previewText: "A message for you",
	blocks: [
		{
			id: crypto.randomUUID(),
			type: "heading",
			props: { text: "Welcome to Dispatchly", level: 1 },
		},
		{
			id: crypto.randomUUID(),
			type: "text",
			props: { content: "Hi {{firstName}}, thanks for joining us." },
		},
		{
			id: crypto.randomUUID(),
			type: "button",
			props: {
				label: "Get Started",
				href: "https://",
				align: "center",
				backgroundColor: "#000000",
				color: "#ffffff",
			},
		},
	],
};

export function useEmailBuilder(initial?: EmailDocument) {
	return useReducer(reducer, initial ?? DEFAULT_DOCUMENT);
}
