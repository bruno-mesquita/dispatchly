export function CTA() {
	return (
		<section
			style={{
				padding: "100px 40px",
				borderBottom: "1px solid var(--hairline)",
				background: "var(--bg)",
			}}
		>
			<div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
				<h2
					style={{
						fontSize: 64,
						fontWeight: 400,
						letterSpacing: -1.6,
						lineHeight: 1.02,
						margin: "0 0 36px",
						color: "var(--fg)",
					}}
				>
					Ship the journey.{" "}
					<span
						style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
					>
						We&apos;ll ship the message.
					</span>
				</h2>
				<div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
					<a
						href="http://localhost:3003/login"
						style={{
							background: "var(--fg)",
							color: "var(--bg)",
							border: "none",
							borderRadius: 6,
							padding: "13px 22px",
							fontSize: 14,
							fontWeight: 500,
							cursor: "pointer",
							fontFamily: "var(--font-sans)",
							textDecoration: "none",
						}}
					>
						Start free →
					</a>
					<button
						type="button"
						style={{
							background: "transparent",
							color: "var(--fg)",
							border: "1px solid var(--hairline)",
							borderRadius: 6,
							padding: "13px 22px",
							fontSize: 14,
							fontWeight: 500,
							cursor: "pointer",
							fontFamily: "var(--font-sans)",
						}}
					>
						Book a call
					</button>
				</div>
			</div>
		</section>
	);
}
