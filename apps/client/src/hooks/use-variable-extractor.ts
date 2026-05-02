"use client";

import { useMemo } from "react";
import type { EmailBlock } from "@/types/email-builder";

const VAR_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

export function useVariableExtractor(blocks: EmailBlock[]): string[] {
	return useMemo(() => {
		const found = new Set<string>();
		for (const block of blocks) {
			for (const val of Object.values(block.props)) {
				if (typeof val === "string") {
					for (const match of val.matchAll(VAR_REGEX)) {
						found.add(match[1]);
					}
				}
			}
		}
		return [...found];
	}, [blocks]);
}
