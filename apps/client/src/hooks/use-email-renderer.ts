"use client";

import { useEffect, useState } from "react";
import type { EmailBlock, VariableMap } from "@/types/email-builder";

function substituteVars(text: string, vars: VariableMap): string {
	return text.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (_, name) =>
		vars[name] !== undefined ? vars[name] : `{{${name}}}`,
	);
}

function buildHtml(blocks: EmailBlock[], vars: VariableMap): string {
	const body = blocks
		.map((block) => {
			switch (block.type) {
				case "heading": {
					const p = block.props as { text: string; level: number };
					const sizes: Record<number, string> = {
						1: "28px",
						2: "22px",
						3: "18px",
					};
					return `<h${p.level} style="font-family:sans-serif;font-size:${sizes[p.level] ?? "22px"};color:#111;margin:16px 0;">${substituteVars(p.text, vars)}</h${p.level}>`;
				}
				case "text": {
					const p = block.props as { content: string };
					return `<p style="font-family:sans-serif;font-size:15px;color:#333;line-height:1.6;margin:12px 0;">${substituteVars(p.content, vars)}</p>`;
				}
				case "button": {
					const p = block.props as {
						label: string;
						href: string;
						align: string;
						backgroundColor: string;
						color: string;
					};
					const href = substituteVars(p.href, vars);
					const label = substituteVars(p.label, vars);
					return `<div style="text-align:${p.align};margin:16px 0;"><a href="${href}" style="display:inline-block;padding:12px 24px;background:${p.backgroundColor};color:${p.color};text-decoration:none;border-radius:4px;font-family:sans-serif;font-size:14px;font-weight:600;">${label}</a></div>`;
				}
				case "image": {
					const p = block.props as { src: string; alt: string; width: number };
					if (!p.src)
						return `<div style="background:#f3f4f6;height:120px;border-radius:4px;margin:12px 0;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:13px;color:#9ca3af;">[Image placeholder]</div>`;
					return `<img src="${substituteVars(p.src, vars)}" alt="${p.alt}" width="${p.width}" style="max-width:100%;height:auto;display:block;margin:12px auto;" />`;
				}
				case "divider": {
					const p = block.props as { color: string };
					return `<hr style="border:none;border-top:1px solid ${p.color};margin:16px 0;" />`;
				}
				case "spacer": {
					const p = block.props as { height: number };
					return `<div style="height:${p.height}px;"></div>`;
				}
				default:
					return "";
			}
		})
		.join("\n");

	return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px 16px;background:#f9fafb;"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;border:1px solid #e5e7eb;">${body}</div></body></html>`;
}

export function useEmailRenderer(blocks: EmailBlock[], vars: VariableMap) {
	const [html, setHtml] = useState(() => buildHtml(blocks, vars));

	useEffect(() => {
		const timer = setTimeout(() => {
			setHtml(buildHtml(blocks, vars));
		}, 300);
		return () => clearTimeout(timer);
	}, [blocks, vars]);

	return html;
}
