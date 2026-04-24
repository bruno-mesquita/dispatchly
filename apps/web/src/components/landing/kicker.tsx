export function Kicker({ num, label }: { num: string; label: string }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				fontFamily: "var(--font-mono)",
				fontSize: 11,
				color: "var(--muted-foreground)",
				textTransform: "uppercase",
				letterSpacing: 0.8,
				marginBottom: 14,
			}}
		>
			<span style={{ color: "var(--accent)" }}>{num}</span>
			<span
				style={{
					width: 18,
					height: 1,
					background: "var(--muted-foreground)",
					opacity: 0.5,
				}}
			/>
			<span>{label}</span>
		</div>
	);
}
