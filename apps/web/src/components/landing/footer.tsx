import { DWordmark } from "./logo";
import { PulseDot } from "./pulse-dot";

const FOOTER_COLS: ReadonlyArray<
	readonly [
		string,
		ReadonlyArray<{ readonly label: string; readonly href: string }>,
	]
> = [
	[
		"Product",
		[
			{ label: "Email", href: "/" },
			{ label: "SMS", href: "/" },
			{ label: "Push", href: "/" },
			{ label: "Journeys", href: "/" },
			{ label: "Templates", href: "/" },
			{ label: "Segments", href: "/" },
		],
	],
	[
		"Developers",
		[
			{ label: "Documentation", href: "/docs" },
			{ label: "API reference", href: "/docs" },
			{ label: "SDKs", href: "/docs" },
			{ label: "Webhooks", href: "/docs" },
			{ label: "Status", href: "/" },
			{ label: "Changelog", href: "/changelog" },
		],
	],
	[
		"Company",
		[
			{ label: "About", href: "/about" },
			{ label: "Customers", href: "/customers" },
			{ label: "Careers", href: "/" },
			{ label: "Security", href: "/" },
			{ label: "Privacy", href: "/" },
			{ label: "Terms", href: "/" },
		],
	],
	[
		"Resources",
		[
			{ label: "Blog", href: "/" },
			{ label: "Guides", href: "/" },
			{ label: "Deliverability", href: "/" },
			{ label: "Compliance", href: "/" },
			{ label: "Community", href: "/" },
		],
	],
];

export function Footer() {
	return (
		<footer
			style={{
				borderTop: "1px solid var(--border)",
				padding: "60px 40px 28px",
				background: "var(--background)",
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
							color: "var(--muted-foreground)",
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
							color: "var(--muted-foreground)",
						}}
					>
						{["SOC 2", "GDPR", "HIPAA"].map((b) => (
							<span
								key={b}
								style={{
									padding: "3px 7px",
									border: "1px solid var(--border)",
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
								color: "var(--muted-foreground)",
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
									key={it.label}
									href={it.href}
									style={{ color: "var(--foreground)", textDecoration: "none" }}
								>
									{it.label}
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
					borderTop: "1px solid var(--border)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: 11.5,
					color: "var(--muted-foreground)",
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
