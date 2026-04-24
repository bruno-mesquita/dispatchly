import { DWordmark } from "./logo";
import { PulseDot } from "./pulse-dot";

const FOOTER_COLS: ReadonlyArray<readonly [string, readonly string[]]> = [
	["Product", ["Email", "SMS", "Push", "Journeys", "Templates", "Segments"]],
	[
		"Developers",
		[
			"Documentation",
			"API reference",
			"SDKs",
			"Webhooks",
			"Status",
			"Changelog",
		],
	],
	[
		"Company",
		["About", "Customers", "Careers", "Security", "Privacy", "Terms"],
	],
	[
		"Resources",
		["Blog", "Guides", "Deliverability", "Compliance", "Community"],
	],
];

export function Footer() {
	return (
		<footer
			style={{
				borderTop: "1px solid var(--hairline)",
				padding: "60px 40px 28px",
				background: "var(--bg)",
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "1.4fr repeat(4, 1fr)",
					gap: 40,
				}}
			>
				<div>
					<DWordmark size={20} />
					<div
						style={{
							fontSize: 12,
							color: "var(--fg-dim)",
							marginTop: 14,
							maxWidth: 240,
							lineHeight: 1.6,
						}}
					>
						Multichannel dispatch for product teams. Journeys, transactional,
						and broadcast from one API.
					</div>
					<div
						style={{
							display: "flex",
							gap: 8,
							marginTop: 18,
							fontFamily: "var(--font-mono)",
							fontSize: 10.5,
							color: "var(--fg-dim)",
						}}
					>
						{["SOC 2", "GDPR", "HIPAA"].map((b) => (
							<span
								key={b}
								style={{
									padding: "3px 7px",
									border: "1px solid var(--hairline)",
									borderRadius: 4,
								}}
							>
								{b}
							</span>
						))}
					</div>
				</div>
				{FOOTER_COLS.map(([title, items]) => (
					<div key={title}>
						<div
							style={{
								fontSize: 11,
								color: "var(--fg-dim)",
								textTransform: "uppercase",
								letterSpacing: 0.8,
								fontFamily: "var(--font-mono)",
								marginBottom: 14,
							}}
						>
							{title}
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 8,
								fontSize: 13,
							}}
						>
							{items.map((it) => (
								<a
									key={it}
									href="/"
									style={{ color: "var(--fg)", textDecoration: "none" }}
								>
									{it}
								</a>
							))}
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					maxWidth: 1200,
					margin: "56px auto 0",
					paddingTop: 20,
					borderTop: "1px solid var(--hairline)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: 11.5,
					color: "var(--fg-dim)",
					fontFamily: "var(--font-mono)",
				}}
			>
				<div>© 2026 Dispatchly, Inc. — All dispatches accounted for.</div>
				<div style={{ display: "flex", gap: 16, alignItems: "center" }}>
					<span
						style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
					>
						<PulseDot color="var(--ok)" size={5} />
						All systems operational
					</span>
					<span>v4.12.0</span>
				</div>
			</div>
		</footer>
	);
}
