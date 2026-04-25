"use client";

export function PulseDot({ color = "var(--color-green-500)", size = 6 }: { color?: string; size?: number }) {
	return (
		<span
			className="relative inline-flex"
			style={{ width: size, height: size }}
		>
			<span
				className="absolute inset-0 animate-ping rounded-full opacity-40"
				style={{ backgroundColor: color }}
			/>
			<span
				className="relative rounded-full"
				style={{ width: size, height: size, backgroundColor: color }}
			/>
		</span>
	);
}
