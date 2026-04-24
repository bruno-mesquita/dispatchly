export function PulseDot({
	color = "#00B87C",
	size = 6,
}: {
	color?: string;
	size?: number;
}) {
	return (
		<span
			style={{
				position: "relative",
				display: "inline-flex",
				width: size,
				height: size,
			}}
		>
			<span
				style={{
					position: "absolute",
					inset: 0,
					borderRadius: "50%",
					background: color,
					animation: "dpl-ping 1.8s ease-out infinite",
					opacity: 0.4,
				}}
			/>
			<span
				style={{
					position: "relative",
					width: size,
					height: size,
					borderRadius: "50%",
					background: color,
				}}
			/>
		</span>
	);
}
