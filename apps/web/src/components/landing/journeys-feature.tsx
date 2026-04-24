import { JourneyDiagram } from "./journey-diagram";
import { Kicker } from "./kicker";

export function JourneysFeature() {
	return (
		<section
			style={{
				padding: "70px 40px",
				borderBottom: "1px solid var(--hairline)",
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "1fr 1.2fr",
					gap: 60,
					alignItems: "center",
				}}
			>
				<div>
					<Kicker num="02" label="Journeys" />
					<h2
						style={{
							fontSize: 36,
							fontWeight: 500,
							letterSpacing: -0.8,
							margin: "0 0 16px",
							lineHeight: 1.1,
							color: "var(--fg)",
						}}
					>
						Orchestrate across channels without a CDP.
					</h2>
					<p
						style={{
							fontSize: 15,
							color: "var(--fg-dim)",
							lineHeight: 1.6,
							margin: "0 0 24px",
						}}
					>
						Define flows in code or in the visual editor. Branch on traits, wait
						on events, fall back across channels. Every step is versioned and
						replayable.
					</p>
					<div style={{ display: "flex", flexDirection: "column" }}>
						{[
							[
								"Event triggers",
								"Kick off from any server-side event or webhook.",
							],
							[
								"Conditional branches",
								"Wait up to 30 days, check traits, branch on opens or clicks.",
							],
							[
								"Channel fallback",
								"If push isn't delivered in 5 min, SMS. If SMS fails, email.",
							],
							[
								"Journey as code",
								"Define in TS, version in git, deploy with your app.",
							],
						].map(([t, d]) => (
							<div
								key={t as string}
								style={{
									display: "flex",
									gap: 12,
									padding: "10px 0",
									borderBottom: "1px solid var(--hairline)",
								}}
							>
								<div
									style={{
										width: 16,
										paddingTop: 2,
										color: "var(--accent)",
										flexShrink: 0,
									}}
								>
									→
								</div>
								<div>
									<div
										style={{
											fontSize: 13,
											fontWeight: 500,
											color: "var(--fg)",
										}}
									>
										{t as string}
									</div>
									<div
										style={{
											fontSize: 12,
											color: "var(--fg-dim)",
											marginTop: 2,
										}}
									>
										{d as string}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<JourneyDiagram />
			</div>
		</section>
	);
}
