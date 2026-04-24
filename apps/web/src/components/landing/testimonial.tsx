import { Kicker } from "./kicker";

export function Testimonial() {
	return (
		<section
			style={{
				padding: "70px 40px",
				borderBottom: "1px solid var(--border)",
			}}
		>
			<div style={{ maxWidth: 900, margin: "0 auto" }}>
				<Kicker num="03" label="Field Report" />
				<blockquote
					style={{
						margin: 0,
						fontSize: 28,
						fontWeight: 500,
						letterSpacing: -0.5,
						lineHeight: 1.3,
						color: "var(--foreground)",
					}}
				>
					We replaced three vendors and a queue with Dispatchly in a weekend.
					The log alone saved us more engineer-hours this quarter than we paid
					for the whole year.
				</blockquote>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginTop: 28,
					}}
				>
					<div
						style={{
							width: 36,
							height: 36,
							borderRadius: 18,
							background: "var(--accent-tint)",
							color: "var(--accent)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 13,
							fontWeight: 600,
							border: "1px solid var(--border)",
						}}
					>
						MR
					</div>
					<div>
						<div
							style={{
								fontSize: 14,
								fontWeight: 500,
								color: "var(--foreground)",
							}}
						>
							Maya Rao
						</div>
						<div
							style={{
								fontSize: 12,
								color: "var(--muted-foreground)",
								fontFamily: "var(--font-mono)",
							}}
						>
							Staff Eng · Loop.io
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
