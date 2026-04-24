import { Kicker } from "./kicker";

const PLANS = [
	{
		name: "Free",
		price: "$0",
		sub: "up to 10k/mo",
		feat: ["All 3 channels", "1 journey", "Community support"],
		hi: false,
	},
	{
		name: "Scale",
		price: "$49",
		sub: "per million",
		feat: ["Unlimited journeys", "A/B testing", "Priority routing", "SSO"],
		hi: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		sub: "high-volume",
		feat: ["Dedicated IPs", "Custom SLA", "HIPAA BAA", "On-prem queue"],
		hi: false,
	},
] as const;

export function Pricing() {
	return (
		<section
			style={{
				padding: "80px 40px",
				borderBottom: "1px solid var(--border)",
				background: "var(--secondary)",
			}}
		>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				<Kicker num="04" label="Pricing" />
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 2fr",
						gap: 60,
						alignItems: "center",
					}}
				>
					<h2
						style={{
							fontSize: 40,
							fontWeight: 400,
							letterSpacing: -1,
							margin: 0,
							lineHeight: 1.05,
							color: "var(--foreground)",
						}}
					>
						Pay for what you dispatch.{" "}
						<span
							style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
						>
							Nothing else.
						</span>
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 12,
						}}
					>
						{PLANS.map((p) => (
							<div
								key={p.name}
								style={{
									background: p.hi ? "var(--foreground)" : "var(--background)",
									color: p.hi ? "var(--background)" : "var(--foreground)",
									border:
										"1px solid " +
										(p.hi ? "var(--foreground)" : "var(--border)"),
									borderRadius: 6,
									padding: 20,
									display: "flex",
									flexDirection: "column",
									gap: 10,
								}}
							>
								<div
									style={{
										fontSize: 12,
										fontFamily: "var(--font-mono)",
										textTransform: "uppercase",
										letterSpacing: 0.6,
										opacity: 0.7,
									}}
								>
									{p.name}
								</div>
								<div>
									<span
										style={{
											fontSize: 32,
											fontWeight: 500,
											letterSpacing: -0.8,
										}}
									>
										{p.price}
									</span>
									<span
										style={{
											fontSize: 12,
											marginLeft: 6,
											opacity: 0.6,
											fontFamily: "var(--font-mono)",
										}}
									>
										{p.sub}
									</span>
								</div>
								<div
									style={{
										height: 1,
										background: p.hi
											? "rgba(250,250,247,0.15)"
											: "var(--border)",
									}}
								/>
								<div
									style={{ display: "flex", flexDirection: "column", gap: 6 }}
								>
									{p.feat.map((f) => (
										<div
											key={f}
											style={{
												fontSize: 13,
												display: "flex",
												gap: 8,
												alignItems: "flex-start",
											}}
										>
											<span style={{ opacity: 0.5, flexShrink: 0 }}>→</span>
											<span>{f}</span>
										</div>
									))}
								</div>
								<button
									type="button"
									style={{
										marginTop: "auto",
										background: p.hi
											? "var(--background)"
											: "var(--foreground)",
										color: p.hi ? "var(--foreground)" : "var(--background)",
										border: "none",
										borderRadius: 5,
										padding: "9px 14px",
										fontSize: 13,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "var(--font-sans)",
									}}
								>
									{p.name === "Enterprise" ? "Contact sales" : "Get started"}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
