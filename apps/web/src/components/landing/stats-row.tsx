export function StatsRow() {
	return (
		<section
			style={{
				padding: "70px 40px",
				borderBottom: "1px solid var(--border)",
				background: "var(--secondary)",
			}}
		>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						borderTop: "1px solid var(--border)",
						borderBottom: "1px solid var(--border)",
					}}
				>
					{(
						[
							["99.998%", "uptime · 90d", "us-east-1 · eu-west-1 · ap-south-1"],
							["47ms", "p99 API latency", "from your backend to the queue"],
							["2.4B", "dispatches / month", "across every plan"],
						] as const
					).map(([n, l, s], i) => (
						<div
							key={l as string}
							style={{
								padding: "32px 20px",
								borderRight: i < 2 ? "1px solid var(--border)" : "none",
							}}
						>
							<div
								style={{
									fontSize: 56,
									fontWeight: 500,
									letterSpacing: -1.8,
									lineHeight: 1,
									color: "var(--foreground)",
								}}
							>
								{n as string}
							</div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 500,
									color: "var(--foreground)",
									marginTop: 8,
								}}
							>
								{l as string}
							</div>
							<div
								style={{
									fontSize: 11,
									fontFamily: "var(--font-mono)",
									color: "var(--muted-foreground)",
									marginTop: 4,
								}}
							>
								{s as string}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
