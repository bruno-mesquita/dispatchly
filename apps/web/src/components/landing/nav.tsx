import { DWordmark } from "./logo";

export function Nav() {
	return (
		<nav
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "18px 40px",
				borderBottom: "1px solid var(--hairline)",
				background: "var(--bg)",
				position: "sticky",
				top: 0,
				zIndex: 10,
			}}
		>
			<DWordmark size={20} />
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 26,
					fontSize: 13,
					color: "var(--fg-dim)",
				}}
			>
				{["Product", "Docs", "Pricing", "Changelog", "Customers"].map((l) => (
					<a
						key={l}
						href="/"
						style={{ color: "inherit", textDecoration: "none" }}
					>
						{l}
					</a>
				))}
			</div>
			<div
				style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}
			>
				<a
					href="http://localhost:3003/login"
					style={{ color: "var(--fg-dim)", textDecoration: "none" }}
				>
					Sign in
				</a>
				<a
					href="http://localhost:3003/login"
					style={{
						background: "var(--fg)",
						color: "var(--bg)",
						border: "none",
						borderRadius: 5,
						padding: "7px 14px",
						fontSize: 13,
						fontWeight: 500,
						cursor: "pointer",
						fontFamily: "var(--font-sans)",
						textDecoration: "none",
					}}
				>
					Start free →
				</a>
			</div>
		</nav>
	);
}
