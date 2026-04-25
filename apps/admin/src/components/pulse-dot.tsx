"use client";

import { cn } from "@dispatchly/ui/lib/utils";

interface PulseDotProps {
	color?: string;
	size?: number;
	className?: string;
}

export function PulseDot({
	color = "var(--ok)",
	size = 6,
	className,
}: PulseDotProps) {
	return (
		<span
			className={cn("relative inline-flex", className)}
			style={{ width: size, height: size }}
		>
			<span
				className="absolute inset-0 animate-[dpl-ping_1.8s_ease-out_infinite] rounded-full opacity-40"
				style={{ background: color }}
			/>
			<span
				className="relative rounded-full"
				style={{ width: size, height: size, background: color }}
			/>
		</span>
	);
}
