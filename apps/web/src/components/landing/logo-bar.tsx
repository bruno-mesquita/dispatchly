export function LogoBar() {
	return (
		<section
			style={{
				padding: "28px 40px",
				borderBottom: "1px solid var(--border)",
				background: "var(--secondary)",
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					display: "flex",
					alignItems: "center",
					gap: 40,
					fontFamily: "var(--font-mono)",
					fontSize: 11,
					color: "var(--muted-foreground)",
				}}
			>
				<span
					style={{
						textTransform: "uppercase",
						letterSpacing: 0.8,
						whiteSpace: "nowrap",
					}}
				>
					Trusted by
				</span>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "space-between",
						gap: 24,
						flexWrap: "wrap",
						fontSize: 15,
						fontWeight: 500,
						color: "var(--foreground)",
						letterSpacing: -0.3,
					}}
				>
					{[
						"Linear",
						"Loop.io",
						"Ramp",
						"Attio",
						"Vercel",
						"Supabase",
						"Resend",
						"Cursor",
					].map((x) => (
						<span key={x} style={{ fontFamily: "var(--font-sans)" }}>
							{x}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
