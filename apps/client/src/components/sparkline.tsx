"use client";

export function Sparkline({
	data,
	width = 120,
	height = 32,
	color = "currentColor",
	fill = false,
}: {
	data: number[];
	width?: number;
	height?: number;
	color?: string;
	fill?: boolean;
}) {
	if (data.length < 2) return null;
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const pts = data.map((d, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - ((d - min) / range) * (height - 4) - 2;
		return [x, y];
	});
	const path = "M" + pts.map((p) => p.join(",")).join(" L");
	const area = path + ` L${width},${height} L0,${height} Z`;
	return (
		<svg width={width} height={height} className="block overflow-visible">
			{fill && <path d={area} fill={color} className="opacity-10" />}
			<path
				d={path}
				stroke={color}
				strokeWidth={1.5}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
