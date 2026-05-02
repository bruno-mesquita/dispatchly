import type { EmailBlock, VariableMap } from "@/types/email-builder";

export const BLOCK_LABELS: Record<string, string> = {
	heading: "Heading",
	text: "Text",
	button: "Button",
	image: "Image",
	divider: "Divider",
	spacer: "Spacer",
};

function sub(text: string, vars: VariableMap) {
	return text.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (_, n) =>
		vars[n] !== undefined ? vars[n] : `{{${n}}}`,
	);
}

export function BlockPreview({
	block,
	vars,
}: {
	block: EmailBlock;
	vars: VariableMap;
}) {
	switch (block.type) {
		case "heading": {
			const p = block.props as { text: string; level: 1 | 2 | 3 };
			const sizes = { 1: "text-2xl", 2: "text-xl", 3: "text-lg" };
			return (
				<p
					className={`font-bold ${sizes[p.level]} truncate text-foreground leading-tight`}
				>
					{sub(p.text, vars) || "Heading"}
				</p>
			);
		}
		case "text": {
			const p = block.props as { content: string };
			return (
				<p className="line-clamp-2 text-muted-foreground text-sm">
					{sub(p.content, vars) || "Text block"}
				</p>
			);
		}
		case "button": {
			const p = block.props as {
				label: string;
				align: string;
				backgroundColor: string;
				color: string;
			};
			return (
				<div
					className={`flex ${p.align === "center" ? "justify-center" : p.align === "right" ? "justify-end" : "justify-start"}`}
				>
					<span
						className="rounded px-4 py-2 font-semibold text-xs"
						style={{ background: p.backgroundColor, color: p.color }}
					>
						{sub(p.label, vars) || "Button"}
					</span>
				</div>
			);
		}
		case "image": {
			const p = block.props as { src: string; alt: string };
			return p.src ? (
				// biome-ignore lint/performance/noImgElement: canvas preview, not a page image
				<img
					src={p.src}
					alt={p.alt}
					className="max-h-24 rounded object-cover"
				/>
			) : (
				<div className="flex h-16 items-center justify-center rounded border border-border border-dashed text-muted-foreground text-xs">
					[Image]
				</div>
			);
		}
		case "divider":
			return <hr className="border-border" />;
		case "spacer": {
			const p = block.props as { height: number };
			return (
				<div className="flex items-center justify-center text-muted-foreground text-xs">
					↕ {p.height}px spacer
				</div>
			);
		}
		default:
			return null;
	}
}
