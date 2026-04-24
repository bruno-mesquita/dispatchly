// Variation 1: GRID ATLAS
// Classic Linear/Vercel ultra-minimal — grid background, big hero with
// monospace headline, live log embedded, stat row, feature grid w/ codeblocks.

function V1GridAtlas() {
	const [codeTab, setCodeTab] = React.useState("node");
	const codes = {
		node: `import { Dispatchly } from '@dispatchly/node'

const dx = new Dispatchly({ key: process.env.DX_KEY })

// trigger a multi-channel journey
await dx.journeys.start('onboarding.welcome', {
  user: { id: 'usr_8a2f', email: 'ada@loop.io', phone: '+1415…' },
  traits: { plan: 'pro', signup_source: 'referral' },
})`,
		curl: `$ curl -X POST https://api.dispatchly.com/v1/journeys/start \\
    -H "Authorization: Bearer $DX_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
      "journey": "onboarding.welcome",
      "user": { "id": "usr_8a2f", "email": "ada@loop.io" },
      "traits": { "plan": "pro" }
    }'

# → 202 Accepted
# { "run_id": "run_01HNXQ9K", "status": "queued" }`,
		python: `from dispatchly import Dispatchly

dx = Dispatchly(key=os.environ["DX_KEY"])

# trigger a multi-channel journey
dx.journeys.start(
    "onboarding.welcome",
    user={"id": "usr_8a2f", "email": "ada@loop.io"},
    traits={"plan": "pro", "signup_source": "referral"},
)`,
		go: `dx := dispatchly.New(os.Getenv("DX_KEY"))

_, err := dx.Journeys.Start(ctx, &dispatchly.JourneyStart{
    Journey: "onboarding.welcome",
    User:    &dispatchly.User{ID: "usr_8a2f", Email: "ada@loop.io"},
    Traits:  map[string]any{"plan": "pro"},
})`,
	};
	const lang = { node: "ts", curl: "shell", python: "py", go: "go" }[codeTab];

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

			{/* HERO */}
			<section
				style={{
					position: "relative",
					padding: "90px 40px 70px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				{/* faint grid bg */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
						backgroundSize: "48px 48px",
						maskImage:
							"radial-gradient(ellipse at 50% 30%, black 30%, transparent 70%)",
						WebkitMaskImage:
							"radial-gradient(ellipse at 50% 30%, black 30%, transparent 70%)",
						opacity: 0.5,
						pointerEvents: "none",
					}}
				/>
				<div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							padding: "4px 10px",
							border: "1px solid var(--hairline)",
							borderRadius: 20,
							fontSize: 11.5,
							fontFamily: '"JetBrains Mono", monospace',
							color: "var(--fg-dim)",
							marginBottom: 28,
						}}
					>
						<PulseDot color="var(--accent)" size={5} />
						<span>v4.12.0 — Scheduled journeys are here</span>
						<span style={{ color: "var(--accent)" }}>→</span>
					</div>
					<h1
						style={{
							fontSize: 64,
							fontWeight: 500,
							letterSpacing: -1.8,
							lineHeight: 1.02,
							margin: 0,
							maxWidth: 900,
							textWrap: "balance",
						}}
					>
						One API for email,
						<br />
						SMS, and push.
					</h1>
					<div
						style={{
							fontSize: 19,
							color: "var(--fg-dim)",
							marginTop: 22,
							maxWidth: 560,
							lineHeight: 1.5,
							textWrap: "pretty",
						}}
					>
						Dispatchly is the reliable messaging layer for product teams.
						Trigger journeys from your backend, ship transactional events, and
						debug every send — across channels, from one log.
					</div>
					<div style={{ display: "flex", gap: 10, marginTop: 34 }}>
						<button
							style={{
								background: "var(--fg)",
								color: "var(--bg)",
								border: "none",
								borderRadius: 6,
								padding: "11px 18px",
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
								padding: "11px 18px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Read the docs
						</button>
					</div>
					<div
						style={{
							marginTop: 16,
							fontSize: 12,
							color: "var(--fg-dim)",
							fontFamily: '"JetBrains Mono", monospace',
						}}
					>
						10,000 dispatches/mo free · no credit card · 4-min install
					</div>

					{/* hero code + log */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1.3fr 1fr",
							gap: 20,
							marginTop: 56,
						}}
					>
						<CodeBlock
							code={codes[codeTab]}
							lang={lang}
							tabs={["node", "curl", "python", "go"]}
							activeTab={codeTab}
							onTab={setCodeTab}
						/>
						<div
							style={{
								background: "var(--code-bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								overflow: "hidden",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									padding: "8px 14px",
									borderBottom: "1px solid var(--hairline)",
									background: "var(--code-bar)",
									fontSize: 11,
									color: "var(--code-dim)",
									fontFamily: '"JetBrains Mono", monospace',
								}}
							>
								<PulseDot color="var(--ok)" size={5} />
								<span style={{ marginLeft: 8 }}>live · events</span>
								<span style={{ flex: 1 }} />
								<span>tail -f</span>
							</div>
							<div style={{ padding: "14px 16px" }}>
								<LogStream rows={9} speed={1100} compact />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* LOGO BAR */}
			<section
				style={{
					padding: "28px 40px",
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
						gap: 40,
						fontFamily: '"JetBrains Mono", monospace',
						fontSize: 11,
						color: "var(--fg-dim)",
					}}
				>
					<span style={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
						Trusted by
					</span>
					<div
						style={{
							flex: 1,
							display: "flex",
							justifyContent: "space-between",
							gap: 24,
							flexWrap: "wrap",
							fontSize: 15,
							fontWeight: 500,
							color: "var(--fg)",
							letterSpacing: -0.3,
						}}
					>
						{[
							"Linear",
							"Loop.io",
							"Ramp",
							"Attio",
							"Vercel",
							"Supabase",
							"Resend",
							"Cursor",
						].map((x) => (
							<span key={x} style={{ fontFamily: "var(--font-sans)" }}>
								{x}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* METRICS STRIP */}
			<section
				style={{
					padding: "70px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<Kicker num="01" label="Numbers" />
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							justifyContent: "space-between",
							marginBottom: 36,
						}}
					>
						<h2
							style={{
								fontSize: 36,
								fontWeight: 500,
								letterSpacing: -0.8,
								margin: 0,
								maxWidth: 640,
								lineHeight: 1.1,
							}}
						>
							Built for the volume your fastest customer will hit next quarter.
						</h2>
						<div
							style={{
								fontSize: 12,
								color: "var(--fg-dim)",
								fontFamily: '"JetBrains Mono", monospace',
							}}
						>
							updated · just now
						</div>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: 0,
							border: "1px solid var(--hairline)",
							borderRadius: 6,
							overflow: "hidden",
							background: "var(--surface)",
						}}
					>
						{[
							{
								n: <Count to={2.4} decimals={1} suffix="B" />,
								label: "Dispatches / month",
								sub: "across 142 countries",
							},
							{
								n: <Count to={99.993} decimals={3} suffix="%" />,
								label: "Delivery SLA",
								sub: "rolling 90-day p50",
							},
							{
								n: <Count to={47} suffix="ms" />,
								label: "p99 API latency",
								sub: "from edge to queue",
							},
							{
								n: <Count to={11842} />,
								label: "Teams shipping",
								sub: "from indie to IPO",
							},
						].map((s, i) => (
							<div
								key={i}
								style={{
									padding: "28px 24px",
									borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
								}}
							>
								<div
									style={{
										fontSize: 38,
										fontWeight: 500,
										letterSpacing: -0.8,
										lineHeight: 1,
									}}
								>
									{s.n}
								</div>
								<div
									style={{ marginTop: 12, fontSize: 13, color: "var(--fg)" }}
								>
									{s.label}
								</div>
								<div
									style={{
										marginTop: 2,
										fontSize: 11.5,
										color: "var(--fg-dim)",
										fontFamily: '"JetBrains Mono", monospace',
									}}
								>
									{s.sub}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CHANNELS */}
			<section
				style={{
					padding: "70px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<Kicker num="02" label="Channels" />
					<h2
						style={{
							fontSize: 36,
							fontWeight: 500,
							letterSpacing: -0.8,
							margin: "0 0 36px",
							maxWidth: 700,
							lineHeight: 1.1,
						}}
					>
						Three channels. One signature. One log.
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 16,
						}}
					>
						{[
							{
								name: "Email",
								tag: "email.send",
								desc: "React/MJML templates, inline preview, dedicated IPs, auto-warming, and every DMARC/DKIM/BIMI control you'd expect.",
								metric: [
									["Open rate", "42.1%"],
									["Deliverability", "99.8%"],
									["Avg latency", "140ms"],
								],
							},
							{
								name: "SMS",
								tag: "sms.send",
								desc: "Two-way conversations, sender ID pooling across 180 countries, automatic STOP/HELP handling, and toll-free verified routes.",
								metric: [
									["Delivery", "98.4%"],
									["Avg latency", "2.1s"],
									["Countries", "180+"],
								],
							},
							{
								name: "Push",
								tag: "push.send",
								desc: "APNs, FCM, and web push from the same call. Rich media, action buttons, silent updates, and per-device quiet hours.",
								metric: [
									["CTR", "8.7%"],
									["Avg latency", "48ms"],
									["Platforms", "iOS / Android / Web"],
								],
							},
						].map((c) => (
							<div
								key={c.name}
								style={{
									background: "var(--surface)",
									border: "1px solid var(--hairline)",
									borderRadius: 6,
									padding: 22,
									display: "flex",
									flexDirection: "column",
									gap: 14,
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div
										style={{
											fontSize: 18,
											fontWeight: 500,
											letterSpacing: -0.3,
										}}
									>
										{c.name}
									</div>
									<code
										style={{
											fontFamily: '"JetBrains Mono", monospace',
											fontSize: 11,
											color: "var(--accent)",
											background: "var(--accent-tint)",
											padding: "2px 7px",
											borderRadius: 3,
										}}
									>
										{c.tag}
									</code>
								</div>
								<div
									style={{
										fontSize: 13.5,
										color: "var(--fg-dim)",
										lineHeight: 1.55,
									}}
								>
									{c.desc}
								</div>
								<div
									style={{
										borderTop: "1px solid var(--hairline)",
										paddingTop: 14,
										marginTop: 4,
										display: "grid",
										gridTemplateColumns: "repeat(3, 1fr)",
										gap: 8,
										fontSize: 11,
									}}
								>
									{c.metric.map(([l, v]) => (
										<div key={l}>
											<div
												style={{
													color: "var(--fg-dim)",
													fontFamily: '"JetBrains Mono", monospace',
													textTransform: "uppercase",
													letterSpacing: 0.5,
													fontSize: 10,
												}}
											>
												{l}
											</div>
											<div
												style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}
											>
												{v}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* JOURNEYS FEATURE */}
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
						<Kicker num="03" label="Journeys" />
						<h2
							style={{
								fontSize: 36,
								fontWeight: 500,
								letterSpacing: -0.8,
								margin: "0 0 16px",
								lineHeight: 1.1,
							}}
						>
							Orchestrate across channels without a CDP.
						</h2>
						<div
							style={{
								fontSize: 15,
								color: "var(--fg-dim)",
								lineHeight: 1.6,
								marginBottom: 24,
								textWrap: "pretty",
							}}
						>
							Define flows in code or in the visual editor. Branch on traits,
							wait on events, fall back across channels. Every step is versioned
							and replayable.
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
									key={t}
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
											fontFamily: '"JetBrains Mono", monospace',
											fontSize: 11,
										}}
									>
										▸
									</div>
									<div>
										<div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
										<div
											style={{
												fontSize: 12.5,
												color: "var(--fg-dim)",
												marginTop: 2,
											}}
										>
											{d}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* journey visual */}
					<div
						style={{
							background: "var(--surface)",
							border: "1px solid var(--hairline)",
							borderRadius: 6,
							padding: 28,
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 20,
								fontSize: 11.5,
								fontFamily: '"JetBrains Mono", monospace',
								color: "var(--fg-dim)",
							}}
						>
							<span>journeys/onboarding.welcome.ts</span>
							<span
								style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
							>
								<PulseDot color="var(--ok)" size={5} />
								live · 3 runs
							</span>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								gap: 0,
							}}
						>
							<JourneyNode
								type="trigger"
								title="user.signed_up"
								sub="source = referral"
							/>
							<JourneyConnector vertical label="→ immediately" />
							<JourneyNode
								type="email"
								title="Welcome email"
								sub="tpl: welcome.v3"
								highlight
							/>
							<JourneyConnector vertical label="wait 24h" />
							<JourneyNode
								type="branch"
								title="Opened email?"
								sub="if open_count > 0"
							/>
							<div
								style={{
									display: "flex",
									gap: 40,
									marginTop: 10,
									marginLeft: 0,
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<div
										style={{
											fontFamily: '"JetBrains Mono", monospace',
											fontSize: 10,
											color: "var(--ok)",
											marginBottom: 6,
											textTransform: "uppercase",
											letterSpacing: 0.6,
										}}
									>
										yes ↓
									</div>
									<JourneyNode
										type="push"
										title="Product tour nudge"
										sub="rich · tour_01"
										compact
									/>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<div
										style={{
											fontFamily: '"JetBrains Mono", monospace',
											fontSize: 10,
											color: "var(--warn)",
											marginBottom: 6,
											textTransform: "uppercase",
											letterSpacing: 0.6,
										}}
									>
										no ↓
									</div>
									<JourneyNode
										type="sms"
										title="Re-engage SMS"
										sub="tpl: reactivate.v1"
										compact
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* OBSERVABILITY */}
			<section
				style={{
					padding: "70px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<Kicker num="04" label="Observability" />
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							justifyContent: "space-between",
							marginBottom: 28,
						}}
					>
						<h2
							style={{
								fontSize: 36,
								fontWeight: 500,
								letterSpacing: -0.8,
								margin: 0,
								maxWidth: 640,
								lineHeight: 1.1,
							}}
						>
							The deliverability black box, cracked open.
						</h2>
						<div
							style={{
								fontSize: 13,
								color: "var(--fg-dim)",
								maxWidth: 280,
								lineHeight: 1.5,
							}}
						>
							Structured logs per send, per user, per template. Search by
							anything.
						</div>
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: 12,
							marginBottom: 20,
						}}
					>
						<StatCard
							label="sent · 24h"
							value={<Count to={842391} />}
							delta={12}
							spark={[20, 24, 22, 28, 30, 34, 38, 36, 42, 48, 52, 56]}
						/>
						<StatCard
							label="delivered"
							value={<Count to={99.2} decimals={1} suffix="%" />}
							delta={0.3}
							spark={[96, 97, 98, 98, 99, 99, 99, 99, 99, 99, 99, 99]}
						/>
						<StatCard
							label="opened"
							value={<Count to={42.1} decimals={1} suffix="%" />}
							delta={4}
							spark={[32, 34, 36, 38, 40, 42, 41, 40, 42, 43, 42, 42]}
						/>
						<StatCard
							label="bounced"
							value={<Count to={0.14} decimals={2} suffix="%" />}
							delta={-18}
							spark={[
								0.3, 0.28, 0.25, 0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.14, 0.14,
								0.14,
							]}
						/>
					</div>

					<div
						style={{
							background: "var(--surface)",
							border: "1px solid var(--hairline)",
							borderRadius: 6,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								padding: "12px 16px",
								borderBottom: "1px solid var(--hairline)",
								background: "var(--bg-alt)",
								fontSize: 11.5,
								fontFamily: '"JetBrains Mono", monospace',
								color: "var(--fg-dim)",
							}}
						>
							<span style={{ color: "var(--fg)" }}>
								dispatches / last 7 days
							</span>
							<span style={{ flex: 1 }} />
							<span
								style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
							>
								<span
									style={{ width: 8, height: 2, background: "var(--accent)" }}
								/>{" "}
								total
							</span>
						</div>
						<div style={{ padding: "20px 16px 12px" }}>
							<AreaChart
								data={[
									420, 520, 610, 580, 720, 810, 780, 940, 1020, 980, 1180, 1240,
									1310, 1420,
								]}
								color="var(--accent)"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* DEV-FIRST WEBHOOKS + SPEC */}
			<section
				style={{
					padding: "70px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<Kicker num="05" label="For Developers" />
					<h2
						style={{
							fontSize: 36,
							fontWeight: 500,
							letterSpacing: -0.8,
							margin: "0 0 36px",
							maxWidth: 700,
							lineHeight: 1.1,
						}}
					>
						Designed the way you&apos;d design it.
					</h2>
					<div
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
					>
						<div
							style={{
								background: "var(--bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 24,
							}}
						>
							<div
								style={{
									display: "flex",
									gap: 10,
									alignItems: "center",
									marginBottom: 12,
								}}
							>
								<code
									style={{
										fontFamily: '"JetBrains Mono", monospace',
										fontSize: 10,
										color: "var(--accent)",
										background: "var(--accent-tint)",
										padding: "2px 6px",
										borderRadius: 3,
									}}
								>
									POST
								</code>
								<span style={{ fontSize: 13, fontWeight: 500 }}>
									Webhooks with signed payloads
								</span>
							</div>
							<div
								style={{
									fontSize: 13,
									color: "var(--fg-dim)",
									marginBottom: 14,
									lineHeight: 1.55,
								}}
							>
								Every delivery, open, click, bounce, reply. HMAC-signed, retried
								with exponential backoff, deduped by event id.
							</div>
							<CodeBlock
								filename="hook.sent"
								lang="json"
								code={`{
  "id": "evt_01HNXQ9K",
  "type": "email.delivered",
  "dispatch_id": "dsp_8a2f",
  "user_id": "usr_1190",
  "template": "welcome.v3",
  "ts": 1745419200,
  "latency_ms": 142
}`}
							/>
						</div>
						<div
							style={{
								background: "var(--bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 24,
							}}
						>
							<div
								style={{
									display: "flex",
									gap: 10,
									alignItems: "center",
									marginBottom: 12,
								}}
							>
								<code
									style={{
										fontFamily: '"JetBrains Mono", monospace',
										fontSize: 10,
										color: "var(--accent)",
										background: "var(--accent-tint)",
										padding: "2px 6px",
										borderRadius: 3,
									}}
								>
									SDK
								</code>
								<span style={{ fontSize: 13, fontWeight: 500 }}>
									Typed SDKs, generated from the spec
								</span>
							</div>
							<div
								style={{
									fontSize: 13,
									color: "var(--fg-dim)",
									marginBottom: 14,
									lineHeight: 1.55,
								}}
							>
								TypeScript, Python, Go, Ruby, Rust. Autocomplete your way
								through journey ids, template slots, and trait schemas.
							</div>
							<CodeBlock
								filename="dispatchly.d.ts"
								lang="ts"
								code={`type Journey = 'onboarding.welcome'
             | 'billing.past_due'
             | 'retention.nudge'
             // + 14 more, from your codebase

interface StartArgs<J extends Journey> {
  user: UserRef
  traits: TraitsFor<J>   // inferred per journey
  idempotency_key?: string
}`}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* TESTIMONIAL */}
			<section
				style={{
					padding: "70px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 900, margin: "0 auto", textAlign: "left" }}>
					<Kicker num="06" label="Field Report" />
					<blockquote
						style={{
							margin: 0,
							fontSize: 28,
							fontWeight: 500,
							letterSpacing: -0.5,
							lineHeight: 1.3,
							color: "var(--fg)",
							textWrap: "balance",
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
							}}
						>
							MR
						</div>
						<div>
							<div style={{ fontSize: 14, fontWeight: 500 }}>Maya Rao</div>
							<div
								style={{
									fontSize: 12,
									color: "var(--fg-dim)",
									fontFamily: '"JetBrains Mono", monospace',
								}}
							>
								Staff Eng · Loop.io
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				style={{
					padding: "90px 40px",
					borderBottom: "1px solid var(--hairline)",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
						backgroundSize: "48px 48px",
						opacity: 0.35,
						maskImage:
							"radial-gradient(ellipse at center, black 20%, transparent 70%)",
						WebkitMaskImage:
							"radial-gradient(ellipse at center, black 20%, transparent 70%)",
					}}
				/>
				<div
					style={{
						position: "relative",
						maxWidth: 700,
						margin: "0 auto",
						textAlign: "center",
					}}
				>
					<h2
						style={{
							fontSize: 52,
							fontWeight: 500,
							letterSpacing: -1.4,
							lineHeight: 1.05,
							margin: 0,
						}}
					>
						Your next dispatch
						<br />
						is 4 minutes away.
					</h2>
					<div style={{ fontSize: 16, color: "var(--fg-dim)", marginTop: 18 }}>
						Free up to 10,000 dispatches a month. No credit card.
					</div>
					<div
						style={{
							display: "flex",
							gap: 10,
							justifyContent: "center",
							marginTop: 32,
						}}
					>
						<button
							style={{
								background: "var(--fg)",
								color: "var(--bg)",
								border: "none",
								borderRadius: 6,
								padding: "12px 20px",
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
								padding: "12px 20px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Talk to sales
						</button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

window.V1GridAtlas = V1GridAtlas;
