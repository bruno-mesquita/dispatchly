"use client";

import { useState } from "react";
import { CODE_SAMPLES, CodeBlock } from "./code-block";
import { LogStream } from "./log-stream";
import { PulseDot } from "./pulse-dot";

export function Hero() {
	const [activeTab, setActiveTab] = useState("node");
	const sample = CODE_SAMPLES[activeTab];

	return (
		<section
			style={{
				padding: "80px 40px 60px",
				borderBottom: "1px solid var(--border)",
				background: "var(--background)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					pointerEvents: "none",
					backgroundImage:
						"linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
					WebkitMaskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
					maskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
				}}
			/>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					position: "relative",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						fontFamily: "var(--font-mono)",
						fontSize: 11,
						color: "var(--muted-foreground)",
						textTransform: "uppercase",
						letterSpacing: 0.8,
						marginBottom: 28,
					}}
				>
					<span style={{ color: "var(--accent)" }}>01</span>
					<span
						style={{
							width: 18,
							height: 1,
							background: "var(--accent)",
						}}
					/>
					<span>Dispatch orchestration · v4</span>
				</div>
				<h1
					style={{
						fontSize: 72,
						fontWeight: 500,
						letterSpacing: -2,
						lineHeight: 0.98,
						margin: "0 0 28px",
						maxWidth: 700,
						color: "var(--foreground)",
					}}
				>
					Send every message.
					<br />
					<span
						style={{
							fontStyle: "italic",
							fontFamily: "var(--font-serif)",
							fontWeight: 400,
						}}
					>
						One API.
					</span>
				</h1>
				<p
					style={{
						fontSize: 18,
						color: "var(--muted-foreground)",
						maxWidth: 480,
						lineHeight: 1.55,
						margin: "0 0 36px",
					}}
				>
					Email, SMS, and push from a single endpoint. Journeys, transactional,
					and broadcast — observable by default.
				</p>
				<div style={{ display: "flex", gap: 10, marginBottom: 56 }}>
					<a
						href="http://localhost:3003/login"
						style={{
							background: "var(--foreground)",
							color: "var(--background)",
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
							color: "var(--foreground)",
							border: "1px solid var(--border)",
							borderRadius: 6,
							padding: "13px 22px",
							fontSize: 14,
							fontWeight: 500,
							cursor: "pointer",
							fontFamily: "var(--font-sans)",
						}}
					>
						View docs
					</button>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1.3fr 1fr",
						gap: 20,
					}}
				>
					<CodeBlock
						code={sample.code}
						lang={sample.lang}
						tabs={["node", "curl", "python", "go"]}
						activeTab={activeTab}
						onTab={setActiveTab}
					/>
					<div
						style={{
							background: "var(--code-bg)",
							border: "1px solid var(--border)",
							borderRadius: 6,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								padding: "8px 14px",
								borderBottom: "1px solid var(--border)",
								background: "var(--code-bar)",
								fontSize: 11,
								color: "var(--code-dim)",
								fontFamily: "var(--font-mono)",
							}}
						>
							<PulseDot color="var(--ok)" size={5} />
							<span style={{ marginLeft: 8 }}>live · events</span>
							<span style={{ flex: 1 }} />
							<span>tail -f</span>
						</div>
						<div style={{ padding: "14px 16px" }}>
							<LogStream rows={9} speed={1100} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
