const FEATURES = [
	{
		title: "Multi-channel",
		sub: "email · sms · push",
		desc: "Send anywhere your users are. One API. One SDK.",
	},
	{
		title: "Journeys",
		sub: "trigger → wait → branch",
		desc: "Orchestrate flows without a CDP. Versioned in git.",
	},
	{
		title: "Observability",
		sub: "trace every send",
		desc: "Per-user, per-template, per-device logs. Search by anything.",
	},
	{
		title: "Deliverability",
		sub: "SPF · DKIM · DMARC",
		desc: "Dedicated IPs, auto-warming, reputation monitoring.",
	},
] as const;

export function FeatureStrip() {
	return (
		<section
			style={{
				padding: "60px 40px",
				borderBottom: "1px solid var(--border)",
				background: "var(--secondary)",
			}}
		>
			<div
				style={{
					maxWidth: 1280,
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: 0,
					border: "1px solid var(--border)",
					borderRadius: 6,
					overflow: "hidden",
					background: "var(--background)",
				}}
			>
				{FEATURES.map((f, i) => (
					<div
						key={f.title}
						style={{
							padding: "28px 24px",
							borderRight: i < 3 ? "1px solid var(--border)" : "none",
						}}
					>
						<div
							style={{
								fontSize: 14,
								fontWeight: 600,
								color: "var(--foreground)",
							}}
						>
							{f.title}
						</div>
						<div
							style={{
								fontSize: 11,
								fontFamily: "var(--font-mono)",
								color: "var(--muted-foreground)",
								marginTop: 4,
							}}
						>
							{f.sub}
						</div>
						<div
							style={{
								fontSize: 13,
								color: "var(--muted-foreground)",
								marginTop: 10,
								lineHeight: 1.5,
							}}
						>
							{f.desc}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
