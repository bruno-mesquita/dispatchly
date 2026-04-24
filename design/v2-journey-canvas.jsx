// Variation 2: JOURNEY CANVAS
// Landing built around the visual journey metaphor — hero IS the journey graph.
// Editorial, more whitespace, serif touches in callouts, spatial hierarchy.

function V2JourneyCanvas() {
	const [hoveredNode, setHoveredNode] = React.useState(null);

	return (
		<div
			style={{
				width: "100%",
				background: "var(--bg)",
				color: "var(--fg)",
				fontFamily: "var(--font-sans)",
			}}
		>
			<NavBar />

			{/* HERO — giant headline + interactive journey canvas */}
			<section
				style={{
					padding: "80px 40px 60px",
					borderBottom: "1px solid var(--hairline)",
					position: "relative",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1.1fr",
							gap: 60,
							alignItems: "center",
						}}
					>
						<div>
							<div
								style={{
									fontFamily: '"JetBrains Mono", monospace',
									fontSize: 11,
									color: "var(--accent)",
									textTransform: "uppercase",
									letterSpacing: 1,
									marginBottom: 20,
									display: "flex",
									alignItems: "center",
									gap: 10,
								}}
							>
								<span
									style={{ width: 24, height: 1, background: "var(--accent)" }}
								/>
								Dispatch orchestration · v4
							</div>
							<h1
								style={{
									fontSize: 72,
									fontWeight: 400,
									letterSpacing: -2,
									lineHeight: 0.98,
									margin: 0,
									textWrap: "balance",
								}}
							>
								Every message.
								<br />
								<span
									style={{
										fontStyle: "italic",
										fontFamily: "var(--font-serif)",
										fontWeight: 400,
									}}
								>
									One journey.
								</span>
							</h1>
							<div
								style={{
									fontSize: 18,
									color: "var(--fg-dim)",
									marginTop: 28,
									maxWidth: 440,
									lineHeight: 1.55,
								}}
							>
								Stop wiring three vendors together. Dispatchly orchestrates
								email, SMS, and push as a single flow — triggered by your
								events, branched by your data, delivered by us.
							</div>
							<div style={{ display: "flex", gap: 10, marginTop: 34 }}>
								<button
									style={{
										background: "var(--fg)",
										color: "var(--bg)",
										border: "none",
										borderRadius: 6,
										padding: "12px 18px",
										fontSize: 14,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "inherit",
									}}
								>
									Start building →
								</button>
								<button
									style={{
										background: "transparent",
										color: "var(--fg)",
										border: "1px solid var(--hairline)",
										borderRadius: 6,
										padding: "12px 18px",
										fontSize: 14,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "inherit",
									}}
								>
									View a journey
								</button>
							</div>
							<div
								style={{
									marginTop: 22,
									display: "flex",
									gap: 24,
									fontSize: 12,
									color: "var(--fg-dim)",
									fontFamily: '"JetBrains Mono", monospace',
								}}
							>
								<span>↳ 10k/mo free</span>
								<span>↳ SOC 2 Type II</span>
								<span>↳ Open SDKs</span>
							</div>
						</div>

						{/* Hero journey canvas */}
						<div
							style={{
								background: "var(--surface)",
								border: "1px solid var(--hairline)",
								borderRadius: 8,
								padding: 28,
								position: "relative",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 20,
									fontSize: 11,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
									textTransform: "uppercase",
									letterSpacing: 0.6,
								}}
							>
								<span>journey · checkout.recovery</span>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 6,
									}}
								>
									<PulseDot color="var(--ok)" size={5} /> 284 active runs
								</span>
							</div>

							{/* custom journey layout */}
							<div style={{ position: "relative", padding: "6px 0" }}>
								{/* Row 1: trigger */}
								<div style={{ display: "flex", justifyContent: "center" }}>
									<JourneyNode
										type="trigger"
										title="cart.abandoned"
										sub="value > $40"
									/>
								</div>
								<div style={{ display: "flex", justifyContent: "center" }}>
									<JourneyConnector vertical label="wait 30m" />
								</div>

								{/* Row 2: first email */}
								<div style={{ display: "flex", justifyContent: "center" }}>
									<JourneyNode
										type="email"
										title="Nudge email"
										sub="tpl: cart.v2"
										highlight
									/>
								</div>
								<div style={{ display: "flex", justifyContent: "center" }}>
									<JourneyConnector vertical label="wait 6h" />
								</div>

								{/* Row 3: branch + two paths */}
								<div style={{ display: "flex", justifyContent: "center" }}>
									<JourneyNode type="branch" title="Opened & clicked?" />
								</div>

								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: 16,
										marginTop: 14,
									}}
								>
									<div>
										<div
											style={{
												fontSize: 10,
												fontFamily: '"JetBrains Mono", monospace',
												color: "var(--ok)",
												textTransform: "uppercase",
												letterSpacing: 0.6,
												marginBottom: 6,
											}}
										>
											yes · 61%
										</div>
										<JourneyNode
											type="push"
											title="Promo reminder"
											sub="24h later · 10% off"
											compact
										/>
									</div>
									<div>
										<div
											style={{
												fontSize: 10,
												fontFamily: '"JetBrains Mono", monospace',
												color: "var(--warn)",
												textTransform: "uppercase",
												letterSpacing: 0.6,
												marginBottom: 6,
											}}
										>
											no · 39%
										</div>
										<JourneyNode
											type="sms"
											title="Last-call SMS"
											sub="48h · 15% off"
											compact
										/>
									</div>
								</div>
							</div>

							{/* floating metric */}
							<div
								style={{
									marginTop: 20,
									paddingTop: 16,
									borderTop: "1px solid var(--hairline)",
									display: "flex",
									justifyContent: "space-between",
									fontSize: 11,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
								}}
							>
								<span>recovered this week</span>
								<span style={{ color: "var(--fg)", fontWeight: 500 }}>
									$<Count to={48290} />
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* PRINCIPLE STRIP */}
			<section
				style={{
					padding: "32px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
				}}
			>
				<div
					style={{
						maxWidth: 1200,
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontSize: 13,
						color: "var(--fg-dim)",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<span
						style={{
							fontFamily: '"JetBrains Mono", monospace',
							fontSize: 11,
							textTransform: "uppercase",
							letterSpacing: 0.8,
						}}
					>
						Shipping at
					</span>
					{[
						"Linear",
						"Vercel",
						"Ramp",
						"Attio",
						"Cursor",
						"Resend",
						"Supabase",
					].map((x) => (
						<span
							key={x}
							style={{
								fontSize: 15,
								fontWeight: 500,
								color: "var(--fg)",
								letterSpacing: -0.3,
							}}
						>
							{x}
						</span>
					))}
				</div>
			</section>

			{/* 3 STEPS / HOW IT WORKS */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "320px 1fr",
							gap: 60,
						}}
					>
						<div>
							<Kicker num="01" label="How it works" />
							<h2
								style={{
									fontSize: 40,
									fontWeight: 400,
									letterSpacing: -1,
									lineHeight: 1.05,
									margin: 0,
									textWrap: "balance",
								}}
							>
								A journey is{" "}
								<span
									style={{
										fontStyle: "italic",
										fontFamily: "var(--font-serif)",
									}}
								>
									trigger
								</span>
								,{" "}
								<span
									style={{
										fontStyle: "italic",
										fontFamily: "var(--font-serif)",
									}}
								>
									logic
								</span>
								, and{" "}
								<span
									style={{
										fontStyle: "italic",
										fontFamily: "var(--font-serif)",
									}}
								>
									delivery
								</span>
								.
							</h2>
							<div
								style={{
									fontSize: 14,
									color: "var(--fg-dim)",
									marginTop: 20,
									lineHeight: 1.6,
								}}
							>
								Model it once, branch it forever. No more chasing opens across
								dashboards or reconciling bounces from three providers at 2am.
							</div>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: 16,
							}}
						>
							{[
								{
									step: "01",
									title: "Trigger",
									desc: "Any server event, cron, or user action fires a journey. Idempotent by key; scheduled up to 90 days out.",
									code: `dx.events.emit('cart.abandoned', {
  user_id: 'usr_8a2f',
  cart_value: 142.50,
})`,
								},
								{
									step: "02",
									title: "Logic",
									desc: "Wait on time or events, branch on traits, throttle per user, fall back between channels. Versioned in git.",
									code: `wait('6h').branch(
  u => u.opened > 0,
  yes => yes.push('promo'),
  no  => no.sms('lastcall'),
)`,
								},
								{
									step: "03",
									title: "Delivery",
									desc: "We handle IPs, sender pools, quiet hours, retries, DMARC, STOP handling, and device fan-out. You handle the copy.",
									code: `// observed, not requested
delivered_in: 142ms
opened:       41%
clicked:      12%`,
								},
							].map((s) => (
								<div
									key={s.step}
									style={{
										background: "var(--surface)",
										border: "1px solid var(--hairline)",
										borderRadius: 6,
										padding: 20,
										display: "flex",
										flexDirection: "column",
										gap: 14,
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "baseline",
										}}
									>
										<div
											style={{
												fontSize: 22,
												fontFamily: "var(--font-serif)",
												fontStyle: "italic",
												color: "var(--accent)",
											}}
										>
											{s.title}
										</div>
										<div
											style={{
												fontFamily: '"JetBrains Mono", monospace',
												fontSize: 10,
												color: "var(--fg-dim)",
											}}
										>
											{s.step}
										</div>
									</div>
									<div
										style={{
											fontSize: 13,
											color: "var(--fg-dim)",
											lineHeight: 1.55,
										}}
									>
										{s.desc}
									</div>
									<CodeBlock
										code={s.code}
										lang="ts"
										style={{ fontSize: 11.5 }}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* SEGMENTATION + A/B TEST */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<Kicker num="02" label="Segments & Experiments" />
					<h2
						style={{
							fontSize: 40,
							fontWeight: 400,
							letterSpacing: -1,
							margin: "0 0 40px",
							lineHeight: 1.05,
							textWrap: "balance",
						}}
					>
						Slice audiences. Ship variants.{" "}
						<span
							style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
						>
							Learn faster.
						</span>
					</h2>

					<div
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
					>
						{/* Segment venn-ish diagram */}
						<div
							style={{
								background: "var(--bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 24,
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div
								style={{
									fontSize: 12,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
									textTransform: "uppercase",
									letterSpacing: 0.6,
									marginBottom: 14,
								}}
							>
								Segment · power_users_at_risk
							</div>
							<div
								style={{
									flex: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									minHeight: 220,
									position: "relative",
								}}
							>
								<svg
									width="100%"
									viewBox="0 0 400 220"
									style={{ maxWidth: 400 }}
								>
									<circle
										cx="130"
										cy="110"
										r="80"
										fill="var(--accent)"
										fillOpacity="0.1"
										stroke="var(--accent)"
										strokeWidth="1"
									/>
									<circle
										cx="220"
										cy="110"
										r="80"
										fill="var(--accent)"
										fillOpacity="0.1"
										stroke="var(--accent)"
										strokeWidth="1"
									/>
									<circle
										cx="175"
										cy="165"
										r="80"
										fill="var(--accent)"
										fillOpacity="0.1"
										stroke="var(--accent)"
										strokeWidth="1"
									/>
									<text
										x="70"
										y="75"
										fontSize="11"
										fontFamily="JetBrains Mono"
										fill="var(--fg-dim)"
									>
										plan = pro
									</text>
									<text
										x="270"
										y="75"
										fontSize="11"
										fontFamily="JetBrains Mono"
										fill="var(--fg-dim)"
									>
										last_seen &gt; 14d
									</text>
									<text
										x="100"
										y="210"
										fontSize="11"
										fontFamily="JetBrains Mono"
										fill="var(--fg-dim)"
									>
										MRR &gt; $99
									</text>
									<text
										x="160"
										y="145"
										fontSize="20"
										fontWeight="500"
										fill="var(--accent)"
									>
										1,284
									</text>
									<text
										x="160"
										y="162"
										fontSize="10"
										fontFamily="JetBrains Mono"
										fill="var(--fg-dim)"
									>
										users
									</text>
								</svg>
							</div>
							<div
								style={{
									display: "flex",
									gap: 8,
									flexWrap: "wrap",
									paddingTop: 16,
									borderTop: "1px solid var(--hairline)",
								}}
							>
								{['plan = "pro"', "last_seen > 14d", "mrr > 99", "AND"].map(
									(t, i) => (
										<code
											key={i}
											style={{
												fontFamily: '"JetBrains Mono", monospace',
												fontSize: 11,
												padding: "3px 8px",
												background: "var(--surface)",
												border: "1px solid var(--hairline)",
												borderRadius: 4,
												color: i === 3 ? "var(--fg-dim)" : "var(--fg)",
											}}
										>
											{t}
										</code>
									),
								)}
							</div>
						</div>

						{/* A/B test */}
						<div
							style={{
								background: "var(--bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 24,
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<div
									style={{
										fontSize: 12,
										fontFamily: '"JetBrains Mono", monospace',
										color: "var(--fg-dim)",
										textTransform: "uppercase",
										letterSpacing: 0.6,
									}}
								>
									Experiment · subject-line
								</div>
								<div
									style={{
										fontSize: 10.5,
										fontFamily: '"JetBrains Mono", monospace',
										color: "var(--ok)",
										padding: "2px 8px",
										background:
											"color-mix(in srgb, var(--ok) 12%, transparent)",
										borderRadius: 3,
									}}
								>
									● SIGNIFICANT · p=0.02
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 12,
									flex: 1,
								}}
							>
								{[
									{
										label: "A",
										copy: '"Your cart is waiting"',
										open: 38.2,
										click: 7.1,
										winner: false,
									},
									{
										label: "B",
										copy: '"Still thinking it over, Ada?"',
										open: 51.4,
										click: 14.6,
										winner: true,
									},
								].map((v) => (
									<div
										key={v.label}
										style={{
											border:
												"1px solid " +
												(v.winner ? "var(--accent)" : "var(--hairline)"),
											background: v.winner
												? "var(--accent-tint)"
												: "transparent",
											borderRadius: 6,
											padding: 14,
											display: "flex",
											alignItems: "center",
											gap: 14,
										}}
									>
										<div
											style={{
												fontFamily: "var(--font-serif)",
												fontStyle: "italic",
												fontSize: 22,
												color: v.winner ? "var(--accent)" : "var(--fg-dim)",
												minWidth: 20,
											}}
										>
											{v.label}
										</div>
										<div style={{ flex: 1 }}>
											<div style={{ fontSize: 13, fontWeight: 500 }}>
												{v.copy}
											</div>
											<div
												style={{
													fontSize: 11,
													color: "var(--fg-dim)",
													marginTop: 3,
													fontFamily: '"JetBrains Mono", monospace',
												}}
											>
												open {v.open}% · click {v.click}%
											</div>
										</div>
										{v.winner && (
											<div
												style={{
													fontSize: 10.5,
													fontFamily: '"JetBrains Mono", monospace',
													color: "var(--accent)",
													textTransform: "uppercase",
													letterSpacing: 0.6,
												}}
											>
												winner
											</div>
										)}
									</div>
								))}
							</div>
							<div
								style={{
									marginTop: 14,
									paddingTop: 14,
									borderTop: "1px solid var(--hairline)",
									display: "flex",
									justifyContent: "space-between",
									fontSize: 11,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
								}}
							>
								<span>↑ 13.2% open lift · +7.5% click lift</span>
								<span>n = 24,812</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* TEMPLATES GALLERY */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-end",
							marginBottom: 32,
						}}
					>
						<div>
							<Kicker num="03" label="Templates" />
							<h2
								style={{
									fontSize: 40,
									fontWeight: 400,
									letterSpacing: -1,
									margin: 0,
									maxWidth: 620,
									lineHeight: 1.05,
								}}
							>
								A{" "}
								<span
									style={{
										fontStyle: "italic",
										fontFamily: "var(--font-serif)",
									}}
								>
									starter kit
								</span>{" "}
								for every journey you&apos;ll ever ship.
							</h2>
						</div>
						<div
							style={{
								fontSize: 12,
								color: "var(--fg-dim)",
								fontFamily: '"JetBrains Mono", monospace',
							}}
						>
							62 templates · git-versioned · MJML + React
						</div>
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: 12,
						}}
					>
						{[
							{ name: "Welcome series", ch: "3 emails · 1 push", color: 1 },
							{ name: "Cart recovery", ch: "email · sms · push", color: 2 },
							{ name: "Trial nurture", ch: "5 emails · 2 push", color: 3 },
							{ name: "Password reset", ch: "email · sms", color: 1 },
							{ name: "Weekly digest", ch: "email", color: 2 },
							{ name: "Payment failed", ch: "email · sms", color: 3 },
							{ name: "New device login", ch: "email · push", color: 1 },
							{ name: "Win-back", ch: "email · push", color: 2 },
						].map((t) => (
							<div
								key={t.name}
								style={{
									background: "var(--surface)",
									border: "1px solid var(--hairline)",
									borderRadius: 6,
									overflow: "hidden",
									cursor: "pointer",
									transition: "transform .15s",
								}}
							>
								<div
									style={{
										aspectRatio: "4 / 3",
										background: `repeating-linear-gradient(${t.color * 30 + 130}deg, var(--hairline) 0, var(--hairline) 1px, transparent 1px, transparent 9px)`,
										borderBottom: "1px solid var(--hairline)",
										position: "relative",
									}}
								>
									<div
										style={{
											position: "absolute",
											inset: 14,
											background: "var(--bg)",
											border: "1px solid var(--hairline)",
											borderRadius: 4,
											padding: 10,
											display: "flex",
											flexDirection: "column",
											gap: 5,
										}}
									>
										<div
											style={{
												height: 5,
												background: "var(--fg)",
												borderRadius: 2,
												width: "40%",
											}}
										/>
										<div
											style={{
												height: 3,
												background: "var(--hairline)",
												borderRadius: 2,
												width: "100%",
											}}
										/>
										<div
											style={{
												height: 3,
												background: "var(--hairline)",
												borderRadius: 2,
												width: "85%",
											}}
										/>
										<div
											style={{
												height: 3,
												background: "var(--hairline)",
												borderRadius: 2,
												width: "70%",
											}}
										/>
										<div style={{ flex: 1 }} />
										<div
											style={{
												height: 12,
												background: "var(--accent)",
												borderRadius: 2,
												width: "38%",
											}}
										/>
									</div>
								</div>
								<div style={{ padding: "12px 14px" }}>
									<div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
									<div
										style={{
											fontSize: 11,
											color: "var(--fg-dim)",
											fontFamily: '"JetBrains Mono", monospace',
											marginTop: 3,
										}}
									>
										{t.ch}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* PRICING TEASER */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
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
								textWrap: "balance",
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
							{[
								{
									name: "Free",
									price: "$0",
									sub: "up to 10k/mo",
									feat: ["All 3 channels", "1 journey", "Community support"],
								},
								{
									name: "Scale",
									price: "$49",
									sub: "per million",
									feat: [
										"Unlimited journeys",
										"A/B testing",
										"Priority routing",
										"SSO",
									],
									hi: true,
								},
								{
									name: "Enterprise",
									price: "Custom",
									sub: "high-volume",
									feat: [
										"Dedicated IPs",
										"Custom SLA",
										"HIPAA BAA",
										"On-prem queue",
									],
								},
							].map((p) => (
								<div
									key={p.name}
									style={{
										background: p.hi ? "var(--fg)" : "var(--bg)",
										color: p.hi ? "var(--bg)" : "var(--fg)",
										border:
											"1px solid " + (p.hi ? "var(--fg)" : "var(--hairline)"),
										borderRadius: 6,
										padding: 20,
										display: "flex",
										flexDirection: "column",
										gap: 10,
									}}
								>
									<div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
									<div
										style={{
											fontSize: 28,
											fontWeight: 400,
											letterSpacing: -0.8,
										}}
									>
										{p.price}
										<span style={{ fontSize: 12, opacity: 0.6, marginLeft: 6 }}>
											{p.sub}
										</span>
									</div>
									<div
										style={{
											borderTop:
												"1px solid " +
												(p.hi ? "rgba(255,255,255,0.15)" : "var(--hairline)"),
											paddingTop: 10,
											display: "flex",
											flexDirection: "column",
											gap: 6,
											fontSize: 12.5,
										}}
									>
										{p.feat.map((f) => (
											<div key={f} style={{ opacity: 0.85 }}>
												+ {f}
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				style={{
					padding: "100px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
					<h2
						style={{
							fontSize: 64,
							fontWeight: 400,
							letterSpacing: -1.6,
							lineHeight: 1.02,
							margin: 0,
							textWrap: "balance",
						}}
					>
						Ship the journey.{" "}
						<span
							style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
						>
							We&apos;ll ship the message.
						</span>
					</h2>
					<div
						style={{
							display: "flex",
							gap: 10,
							justifyContent: "center",
							marginTop: 36,
						}}
					>
						<button
							style={{
								background: "var(--fg)",
								color: "var(--bg)",
								border: "none",
								borderRadius: 6,
								padding: "13px 22px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Start free →
						</button>
						<button
							style={{
								background: "transparent",
								color: "var(--fg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: "13px 22px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Book a call
						</button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

window.V2JourneyCanvas = V2JourneyCanvas;
