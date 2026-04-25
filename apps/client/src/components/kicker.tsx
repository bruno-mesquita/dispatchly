"use client";

import { cn } from "@dispatchly/ui/lib/utils";

export function Kicker({
	num,
	label,
	className,
}: {
	num: string;
	label: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mb-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.08em]",
				className,
			)}
		>
			<span className="text-primary">{num}</span>
			<span className="h-px w-4 bg-muted-foreground opacity-30" />
			<span className="text-muted-foreground">{label}</span>
		</div>
	);
}
