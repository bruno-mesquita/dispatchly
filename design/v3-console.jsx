// Variation 3: CONSOLE / OPS
// Dense, data-forward dashboard-style landing. Hero is the actual product.
// Terminal pulse, world map of dispatches, bigger observability emphasis.

function V3Console() {
	const [region, setRegion] = React.useState("global");

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
					padding: "72px 40px 40px",
					borderBottom: "1px solid var(--hairline)",
					position: "relative",
				}}
			>
				<div style={{ maxWidth: 1280, margin: "0 auto" }}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "space-between",
							gap: 40,
							marginBottom: 44,
						}}
					>
						<div style={{ flex: 1, maxWidth: 680 }}>
							<div
								style={{
									fontFamily: '"JetBrains Mono", monospace',
									fontSize: 11,
									color: "var(--fg-dim)",
									textTransform: "uppercase",
									letterSpacing: 1,
									marginBottom: 18,
									display: "flex",
									gap: 10,
								}}
							>
								<span>[DISPATCHLY]</span>
								<span>·</span>
								<span style={{ color: "var(--accent)" }}>
									MULTI-CHANNEL OPS
								</span>
							</div>
							<h1
								style={{
									fontSize: 60,
									fontWeight: 500,
									letterSpacing: -1.6,
									lineHeight: 1,
									margin: 0,
									textWrap: "balance",
								}}
							>
								Dispatches, logs, and deliverability —{" "}
								<span style={{ color: "var(--fg-dim)" }}>in one console.</span>
							</h1>
							<div
								style={{
									fontSize: 16,
									color: "var(--fg-dim)",
									marginTop: 20,
									maxWidth: 540,
									lineHeight: 1.55,
								}}
							>
								Every email, SMS, and push — traced from the API call that sent
								it to the device that opened it. Debug deliverability like you
								debug production.
							</div>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 10,
								alignItems: "flex-end",
							}}
						>
							<div style={{ display: "flex", gap: 10 }}>
								<button
									style={{
										background: "var(--accent)",
										color: "var(--bg)",
										border: "none",
										borderRadius: 5,
										padding: "10px 16px",
										fontSize: 13,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "inherit",
									}}
								>
									Get API key →
								</button>
								<button
									style={{
										background: "transparent",
										color: "var(--fg)",
										border: "1px solid var(--hairline)",
										borderRadius: 5,
										padding: "10px 16px",
										fontSize: 13,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "inherit",
									}}
								>
									Open demo console
								</button>
							</div>
							<div
								style={{
									fontSize: 11,
									color: "var(--fg-dim)",
									fontFamily: '"JetBrains Mono", monospace',
									display: "flex",
									gap: 12,
								}}
							>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 5,
									}}
								>
									<PulseDot color="var(--ok)" size={5} /> us-east-1
								</span>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 5,
									}}
								>
									<PulseDot color="var(--ok)" size={5} /> eu-west-1
								</span>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 5,
									}}
								>
									<PulseDot color="var(--ok)" size={5} /> ap-south-1
								</span>
							</div>
						</div>
					</div>

					{/* DASHBOARD PREVIEW */}
					<div
						style={{
							background: "var(--surface)",
							border: "1px solid var(--hairline)",
							borderRadius: 8,
							overflow: "hidden",
							boxShadow:
								"0 30px 80px -20px rgba(0,0,0,0.18), 0 0 0 1px var(--hairline)",
						}}
					>
						{/* toolbar */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								padding: "10px 14px",
								borderBottom: "1px solid var(--hairline)",
								background: "var(--bg-alt)",
								gap: 16,
								fontSize: 12,
								fontFamily: '"JetBrains Mono", monospace',
							}}
						>
							<div style={{ display: "flex", gap: 6 }}>
								<span
									style={{
										width: 11,
										height: 11,
										borderRadius: 6,
										background: "var(--hairline)",
									}}
								/>
								<span
									style={{
										width: 11,
										height: 11,
										borderRadius: 6,
										background: "var(--hairline)",
									}}
								/>
								<span
									style={{
										width: 11,
										height: 11,
										borderRadius: 6,
										background: "var(--hairline)",
									}}
								/>
							</div>
							<div style={{ color: "var(--fg-dim)" }}>
								app.dispatchly.com / live
							</div>
							<div style={{ flex: 1 }} />
							<div
								style={{
									display: "flex",
									gap: 4,
									padding: 2,
									background: "var(--surface)",
									border: "1px solid var(--hairline)",
									borderRadius: 4,
								}}
							>
								{["global", "americas", "europe", "apac"].map((r) => (
									<button
										key={r}
										onClick={() => setRegion(r)}
										style={{
											border: "none",
											background: region === r ? "var(--fg)" : "transparent",
											color: region === r ? "var(--bg)" : "var(--fg-dim)",
											padding: "3px 8px",
											fontFamily: "inherit",
											fontSize: 11,
											cursor: "pointer",
											borderRadius: 2,
											textTransform: "uppercase",
											letterSpacing: 0.5,
										}}
									>
										{r}
									</button>
								))}
							</div>
							<div
								style={{
									color: "var(--fg-dim)",
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
								}}
							>
								<PulseDot color="var(--ok)" size={5} />
								live
							</div>
						</div>

						{/* main grid */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "200px 1fr 340px",
								minHeight: 520,
							}}
						>
							{/* sidebar */}
							<div
								style={{
									borderRight: "1px solid var(--hairline)",
									padding: "14px 10px",
									display: "flex",
									flexDirection: "column",
									gap: 2,
									fontSize: 12.5,
									fontFamily: '"JetBrains Mono", monospace',
								}}
							>
								{[
									["Overview", true],
									["Dispatches", false],
									["Journeys", false],
									["Templates", false],
									["Segments", false],
									["Logs", false],
									["Webhooks", false],
									["Deliverability", false],
									["Keys & IPs", false],
								].map(([n, a]) => (
									<div
										key={n}
										style={{
											padding: "6px 10px",
											borderRadius: 4,
											background: a ? "var(--accent-tint)" : "transparent",
											color: a ? "var(--accent)" : "var(--fg-dim)",
											cursor: "pointer",
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<span>{n}</span>
										{a && <span>▸</span>}
									</div>
								))}
								<div
									style={{
										marginTop: "auto",
										paddingTop: 14,
										borderTop: "1px solid var(--hairline)",
										fontSize: 10.5,
										color: "var(--fg-dim)",
									}}
								>
									<div>team: loop.io</div>
									<div style={{ marginTop: 3 }}>
										env:{" "}
										<span style={{ color: "var(--accent)" }}>production</span>
									</div>
								</div>
							</div>

							{/* center content */}
							<div
								style={{
									padding: 18,
									display: "flex",
									flexDirection: "column",
									gap: 14,
									minWidth: 0,
								}}
							>
								{/* KPIs */}
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(4, 1fr)",
										gap: 10,
									}}
								>
									{[
										{
											label: "dispatches · 1h",
											v: <Count to={18492} />,
											d: 12,
											s: [12, 14, 16, 20, 22, 24, 28, 30, 32, 34],
										},
										{
											label: "delivered",
											v: <Count to={99.2} decimals={1} suffix="%" />,
											d: 0.2,
											s: [97, 98, 98, 99, 99, 99, 99, 99, 99, 99],
										},
										{
											label: "p99 latency",
											v: <Count to={47} suffix="ms" />,
											d: -8,
											s: [58, 54, 52, 50, 48, 47, 46, 47, 47, 47],
										},
										{
											label: "errors · 1h",
											v: <Count to={23} />,
											d: -42,
											s: [52, 48, 40, 36, 30, 28, 25, 24, 23, 23],
										},
									].map((k, i) => (
										<div
											key={i}
											style={{
												background: "var(--bg)",
												border: "1px solid var(--hairline)",
												borderRadius: 5,
												padding: 12,
											}}
										>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													fontSize: 10,
													fontFamily: '"JetBrains Mono", monospace',
													color: "var(--fg-dim)",
													textTransform: "uppercase",
													letterSpacing: 0.6,
												}}
											>
												<span>{k.label}</span>
												<span
													style={{
														color: k.d >= 0 ? "var(--ok)" : "var(--err)",
													}}
												>
													{k.d >= 0 ? "+" : ""}
													{k.d}%
												</span>
											</div>
											<div
												style={{
													fontSize: 22,
													fontWeight: 500,
													letterSpacing: -0.5,
													marginTop: 4,
												}}
											>
												{k.v}
											</div>
											<Sparkline data={k.s} width={160} height={20} fill />
										</div>
									))}
								</div>

								{/* chart */}
								<div
									style={{
										background: "var(--bg)",
										border: "1px solid var(--hairline)",
										borderRadius: 5,
										padding: 14,
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											fontSize: 11,
											fontFamily: '"JetBrains Mono", monospace',
											color: "var(--fg-dim)",
											marginBottom: 6,
											textTransform: "uppercase",
											letterSpacing: 0.5,
										}}
									>
										<span>dispatches · 24h · stacked by channel</span>
										<span style={{ display: "flex", gap: 12 }}>
											<span
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: 5,
												}}
											>
												<span
													style={{
														width: 8,
														height: 2,
														background: "var(--accent)",
													}}
												/>{" "}
												email
											</span>
											<span
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: 5,
												}}
											>
												<span
													style={{
														width: 8,
														height: 2,
														background: "var(--fg)",
													}}
												/>{" "}
												sms
											</span>
											<span
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: 5,
												}}
											>
												<span
													style={{
														width: 8,
														height: 2,
														background: "var(--fg-dim)",
													}}
												/>{" "}
												push
											</span>
										</span>
									</div>
									<svg
										width="100%"
										viewBox="0 0 600 130"
										style={{ display: "block" }}
									>
										{[0.25, 0.5, 0.75].map((f) => (
											<line
												key={f}
												x1="0"
												x2="600"
												y1={130 * f}
												y2={130 * f}
												stroke="var(--hairline)"
												strokeDasharray="2 4"
											/>
										))}
										{(() => {
											const N = 40;
											const email = Array.from(
												{ length: N },
												(_, i) =>
													30 +
													20 * Math.sin(i / 4) +
													15 * Math.sin(i / 9) +
													i * 0.8,
											);
											const sms = Array.from(
												{ length: N },
												(_, i) => 15 + 8 * Math.sin(i / 3 + 1) + i * 0.4,
											);
											const push = Array.from(
												{ length: N },
												(_, i) => 20 + 12 * Math.cos(i / 5) + i * 0.5,
											);
											const max = Math.max(
												...email.map((e, i) => e + sms[i] + push[i]),
											);
											const toPts = (arr, base) =>
												arr.map((v, i) => [
													(i / (N - 1)) * 600,
													130 - ((v + base[i]) / max) * 110 - 8,
												]);
											const base0 = new Array(N).fill(0);
											const eSum = email;
											const sSum = eSum.map((v, i) => v + sms[i]);
											const pSum = sSum.map((v, i) => v + push[i]);
											const ep = toPts(email, base0);
											const sp = toPts(sms, email);
											const pp = toPts(push, sSum);
											const toPath = (top, bot) =>
												"M" +
												top.map((p) => p.join(",")).join("L") +
												"L" +
												[...bot]
													.reverse()
													.map((p) => p.join(","))
													.join("L") +
												"Z";
											const zero = ep.map((p) => [p[0], 130]);
											const eBot = zero;
											const sBot = ep;
											const pBot = sp;
											return (
												<>
													<path
														d={toPath(ep, eBot)}
														fill="var(--accent)"
														opacity="0.9"
													/>
													<path
														d={toPath(sp, sBot)}
														fill="var(--fg)"
														opacity="0.85"
													/>
													<path
														d={toPath(pp, pBot)}
														fill="var(--fg-dim)"
														opacity="0.5"
													/>
												</>
											);
										})()}
									</svg>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											fontSize: 9.5,
											color: "var(--fg-dim)",
											fontFamily: '"JetBrains Mono", monospace',
											marginTop: 4,
										}}
									>
										<span>00:00</span>
										<span>06:00</span>
										<span>12:00</span>
										<span>18:00</span>
										<span>now</span>
									</div>
								</div>

								{/* recent journeys table */}
								<div
									style={{
										background: "var(--bg)",
										border: "1px solid var(--hairline)",
										borderRadius: 5,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											padding: "8px 14px",
											borderBottom: "1px solid var(--hairline)",
											fontSize: 11,
											fontFamily: '"JetBrains Mono", monospace',
											color: "var(--fg-dim)",
											textTransform: "uppercase",
											letterSpacing: 0.5,
										}}
									>
										Top journeys · last 24h
									</div>
									<div
										style={{
											fontSize: 12,
											fontFamily: '"JetBrains Mono", monospace',
										}}
									>
										{[
											["onboarding.welcome", "42,819", "99.4%", "var(--ok)"],
											["billing.past_due", "8,412", "97.1%", "var(--ok)"],
											["cart.recovery", "14,902", "94.8%", "var(--warn)"],
											["digest.weekly", "210,441", "99.7%", "var(--ok)"],
										].map((r, i) => (
											<div
												key={i}
												style={{
													display: "grid",
													gridTemplateColumns: "1.5fr 1fr 1fr 40px",
													padding: "7px 14px",
													borderTop: i ? "1px solid var(--hairline)" : "none",
													alignItems: "center",
												}}
											>
												<span>{r[0]}</span>
												<span style={{ color: "var(--fg-dim)" }}>
													{r[1]} runs
												</span>
												<span style={{ color: r[3] }}>● {r[2]}</span>
												<span
													style={{ color: "var(--fg-dim)", textAlign: "right" }}
												>
													→
												</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* right rail: log stream */}
							<div
								style={{
									borderLeft: "1px solid var(--hairline)",
									background: "var(--code-bg)",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<div
									style={{
										padding: "10px 14px",
										borderBottom: "1px solid var(--hairline)",
										fontSize: 11,
										fontFamily: '"JetBrains Mono", monospace',
										color: "var(--code-dim)",
										textTransform: "uppercase",
										letterSpacing: 0.5,
										display: "flex",
										alignItems: "center",
										gap: 8,
									}}
								>
									<PulseDot color="var(--ok)" size={5} />
									<span style={{ color: "var(--code-fg)" }}>events · tail</span>
									<span style={{ flex: 1 }} />
									<span>⌘K</span>
								</div>
								<div
									style={{ padding: "10px 12px", flex: 1, overflow: "hidden" }}
								>
									<LogStream rows={20} speed={850} compact />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FEATURE STRIP */}
			<section
				style={{
					padding: "60px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
				}}
			>
				<div
					style={{
						maxWidth: 1280,
						margin: "0 auto",
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: 0,
						border: "1px solid var(--hairline)",
						borderRadius: 6,
						overflow: "hidden",
						background: "var(--bg)",
					}}
				>
					{[
						[
							"Multi-channel",
							"email · sms · push",
							"Send anywhere your users are. One API. One SDK.",
						],
						[
							"Journeys",
							"trigger → wait → branch",
							"Orchestrate flows without a CDP. Versioned in git.",
						],
						[
							"Observability",
							"trace every send",
							"Per-user, per-template, per-device logs. Search by anything.",
						],
						[
							"Deliverability",
							"SPF · DKIM · DMARC · BIMI",
							"Dedicated IPs, auto-warming, reputation dashboard.",
						],
					].map(([t, k, d], i) => (
						<div
							key={t}
							style={{
								padding: "22px 20px",
								borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
							}}
						>
							<div
								style={{
									fontSize: 11,
									color: "var(--accent)",
									fontFamily: '"JetBrains Mono", monospace',
									textTransform: "uppercase",
									letterSpacing: 0.6,
								}}
							>
								{String(i + 1).padStart(2, "0")}
							</div>
							<div
								style={{
									fontSize: 17,
									fontWeight: 500,
									marginTop: 8,
									letterSpacing: -0.3,
								}}
							>
								{t}
							</div>
							<div
								style={{
									fontSize: 11,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
									marginTop: 4,
								}}
							>
								{k}
							</div>
							<div
								style={{
									fontSize: 13,
									color: "var(--fg-dim)",
									marginTop: 10,
									lineHeight: 1.5,
								}}
							>
								{d}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* WORLDWIDE MAP */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1280, margin: "0 auto" }}>
					<Kicker num="01" label="Global Delivery" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "360px 1fr",
							gap: 40,
							alignItems: "center",
						}}
					>
						<div>
							<h2
								style={{
									fontSize: 36,
									fontWeight: 500,
									letterSpacing: -0.8,
									margin: 0,
									lineHeight: 1.1,
									textWrap: "balance",
								}}
							>
								142 countries.
								<br />9 dispatch regions.
								<br />
								One log.
							</h2>
							<div
								style={{
									fontSize: 14,
									color: "var(--fg-dim)",
									marginTop: 18,
									lineHeight: 1.6,
								}}
							>
								Dispatchly routes each message from the closest region with the
								best reputation for that recipient&apos;s provider. You call one
								endpoint; we handle the geography.
							</div>
							<div
								style={{
									marginTop: 20,
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: 10,
									fontFamily: '"JetBrains Mono", monospace',
									fontSize: 11,
								}}
							>
								{[
									["Last 24h", "18.4M"],
									["Avg hop", "1.2"],
									["p99 global", "142ms"],
									["Uptime · 90d", "99.998%"],
								].map(([l, v]) => (
									<div
										key={l}
										style={{
											border: "1px solid var(--hairline)",
											borderRadius: 4,
											padding: "8px 10px",
										}}
									>
										<div
											style={{
												color: "var(--fg-dim)",
												textTransform: "uppercase",
												letterSpacing: 0.5,
												fontSize: 10,
											}}
										>
											{l}
										</div>
										<div
											style={{
												fontSize: 15,
												fontWeight: 500,
												marginTop: 2,
												color: "var(--fg)",
												fontFamily: "var(--font-sans)",
											}}
										>
											{v}
										</div>
									</div>
								))}
							</div>
						</div>
						<div
							style={{
								background: "var(--surface)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 24,
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* dot-grid world map */}
							<svg
								width="100%"
								viewBox="0 0 800 360"
								style={{ display: "block" }}
							>
								{(() => {
									const dots = [];
									// Rough continent blobs — dots are checked per-coord
									const inBlob = (x, y) => {
										// very rough world silhouette
										const shapes = [
											// north america
											{ cx: 180, cy: 130, rx: 110, ry: 70 },
											{ cx: 210, cy: 200, rx: 40, ry: 50 },
											// south america
											{ cx: 270, cy: 260, rx: 40, ry: 70 },
											// europe
											{ cx: 410, cy: 125, rx: 45, ry: 40 },
											// africa
											{ cx: 430, cy: 230, rx: 55, ry: 70 },
											// asia
											{ cx: 550, cy: 150, rx: 140, ry: 70 },
											// india
											{ cx: 560, cy: 210, rx: 30, ry: 30 },
											// oz
											{ cx: 680, cy: 280, rx: 50, ry: 35 },
										];
										return shapes.some((s) => {
											const dx = (x - s.cx) / s.rx;
											const dy = (y - s.cy) / s.ry;
											return dx * dx + dy * dy < 1;
										});
									};
									for (let x = 20; x < 800; x += 11) {
										for (let y = 30; y < 340; y += 11) {
											if (inBlob(x, y)) dots.push([x, y]);
										}
									}
									return dots.map(([x, y], i) => (
										<circle
											key={i}
											cx={x}
											cy={y}
											r="1.5"
											fill="var(--fg-dim)"
											opacity="0.35"
										/>
									));
								})()}
								{/* hub dots */}
								{[
									[180, 140, "us-east"],
									[140, 180, "us-west"],
									[260, 260, "sa-east"],
									[410, 120, "eu-west"],
									[440, 150, "eu-central"],
									[430, 230, "af-south"],
									[570, 200, "ap-south"],
									[620, 160, "ap-ne"],
									[680, 280, "ap-se"],
								].map(([x, y, name], i) => (
									<g key={name}>
										<circle
											cx={x}
											cy={y}
											r="10"
											fill="var(--accent)"
											opacity="0.15"
										>
											<animate
												attributeName="r"
												values="4;14;4"
												dur="2.5s"
												begin={`${i * 0.3}s`}
												repeatCount="indefinite"
											/>
											<animate
												attributeName="opacity"
												values="0.3;0;0.3"
												dur="2.5s"
												begin={`${i * 0.3}s`}
												repeatCount="indefinite"
											/>
										</circle>
										<circle cx={x} cy={y} r="3.5" fill="var(--accent)" />
										<text
											x={x + 8}
											y={y + 3}
											fontSize="9"
											fontFamily="JetBrains Mono"
											fill="var(--fg-dim)"
										>
											{name}
										</text>
									</g>
								))}
							</svg>
						</div>
					</div>
				</div>
			</section>

			{/* DEBUG / TRACE VIEW */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--bg-alt)",
				}}
			>
				<div style={{ maxWidth: 1280, margin: "0 auto" }}>
					<Kicker num="02" label="Trace view" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1.2fr",
							gap: 40,
							alignItems: "center",
						}}
					>
						<div>
							<h2
								style={{
									fontSize: 36,
									fontWeight: 500,
									letterSpacing: -0.8,
									margin: 0,
									lineHeight: 1.1,
									textWrap: "balance",
								}}
							>
								Every dispatch, traced like a request.
							</h2>
							<div
								style={{
									fontSize: 14,
									color: "var(--fg-dim)",
									marginTop: 18,
									lineHeight: 1.6,
									textWrap: "pretty",
								}}
							>
								Click any send, see the full journey: the API call that
								triggered it, the template render, the provider hop, the device
								receipt, the user open. No more guessing why something
								didn&apos;t arrive.
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 8,
									marginTop: 20,
									fontSize: 12,
									fontFamily: '"JetBrains Mono", monospace',
									color: "var(--fg-dim)",
								}}
							>
								{[
									"↳ search by user id, template, journey, or error code",
									"↳ replay any send with a single click",
									"↳ export to your data warehouse",
									"↳ retention from 7 days to forever",
								].map((x) => (
									<span key={x}>{x}</span>
								))}
							</div>
						</div>
						<div
							style={{
								background: "var(--code-bg)",
								border: "1px solid var(--hairline)",
								borderRadius: 6,
								padding: 20,
								fontFamily: '"JetBrains Mono", monospace',
								fontSize: 11.5,
							}}
						>
							<div
								style={{
									color: "var(--code-dim)",
									marginBottom: 10,
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<span>trace · dsp_01HNXQ9K2M · email / welcome.v3</span>
								<span>218ms total</span>
							</div>
							{(() => {
								const spans = [
									["api.receive", 0, 6, "var(--fg-dim)"],
									["validate.payload", 6, 12, "var(--fg-dim)"],
									["render.template", 12, 48, "var(--accent)"],
									["route.provider", 48, 58, "var(--fg-dim)"],
									["provider.sendgrid", 58, 142, "var(--accent)"],
									["mta.accept", 142, 158, "var(--fg-dim)"],
									["recipient.mta", 158, 196, "var(--fg-dim)"],
									["inbox.place", 196, 218, "var(--ok)"],
								];
								return spans.map(([label, s, e, c], i) => (
									<div
										key={i}
										style={{
											display: "grid",
											gridTemplateColumns: "160px 1fr 60px",
											gap: 10,
											alignItems: "center",
											padding: "3px 0",
										}}
									>
										<span style={{ color: "var(--code-fg)" }}>{label}</span>
										<div
											style={{
												height: 14,
												position: "relative",
												background: "rgba(127,127,127,0.08)",
												borderRadius: 2,
											}}
										>
											<div
												style={{
													position: "absolute",
													left: `${(s / 220) * 100}%`,
													width: `${((e - s) / 220) * 100}%`,
													top: 0,
													bottom: 0,
													background: c,
													borderRadius: 2,
												}}
											/>
										</div>
										<span
											style={{ color: "var(--code-dim)", textAlign: "right" }}
										>
											{e - s}ms
										</span>
									</div>
								));
							})()}
						</div>
					</div>
				</div>
			</section>

			{/* QUICK STATS */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
				}}
			>
				<div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
					<div
						style={{
							fontSize: 11,
							fontFamily: '"JetBrains Mono", monospace',
							color: "var(--fg-dim)",
							textTransform: "uppercase",
							letterSpacing: 1,
							marginBottom: 24,
						}}
					>
						// powers 11,842 teams
					</div>
					<h2
						style={{
							fontSize: 44,
							fontWeight: 500,
							letterSpacing: -1,
							margin: 0,
							lineHeight: 1.05,
							textWrap: "balance",
						}}
					>
						Built like infrastructure. Priced like software.
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 0,
							marginTop: 52,
							borderTop: "1px solid var(--hairline)",
							borderBottom: "1px solid var(--hairline)",
						}}
					>
						{[
							["99.998%", "uptime · 90d", "us-east-1 · eu-west-1 · ap-south-1"],
							["47ms", "p99 API latency", "from your backend to the queue"],
							["2.4B", "dispatches / month", "across every plan"],
						].map(([n, l, s], i) => (
							<div
								key={i}
								style={{
									padding: "32px 20px",
									borderRight: i < 2 ? "1px solid var(--hairline)" : "none",
								}}
							>
								<div
									style={{
										fontSize: 56,
										fontWeight: 500,
										letterSpacing: -1.8,
										lineHeight: 1,
									}}
								>
									{n}
								</div>
								<div
									style={{ fontSize: 13, color: "var(--fg)", marginTop: 10 }}
								>
									{l}
								</div>
								<div
									style={{
										fontSize: 11,
										color: "var(--fg-dim)",
										fontFamily: '"JetBrains Mono", monospace',
										marginTop: 3,
									}}
								>
									{s}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				style={{
					padding: "80px 40px",
					borderBottom: "1px solid var(--hairline)",
					background: "var(--code-bg)",
					color: "var(--code-fg)",
				}}
			>
				<div
					style={{
						maxWidth: 900,
						margin: "0 auto",
						fontFamily: '"JetBrains Mono", monospace',
					}}
				>
					<div style={{ fontSize: 13, color: "var(--code-dim)" }}>
						$ npm install @dispatchly/node
					</div>
					<div style={{ fontSize: 13, color: "var(--accent)", marginTop: 4 }}>
						✓ installed · 28 packages · 2.1s
					</div>
					<div style={{ height: 22 }} />
					<h2
						style={{
							fontSize: 48,
							fontWeight: 500,
							letterSpacing: -1.2,
							margin: 0,
							lineHeight: 1.05,
							color: "var(--code-fg)",
							fontFamily: "var(--font-sans)",
							textWrap: "balance",
						}}
					>
						Dispatch your first message in 4 minutes.
					</h2>
					<div style={{ display: "flex", gap: 10, marginTop: 28 }}>
						<button
							style={{
								background: "var(--accent)",
								color: "#fff",
								border: "none",
								borderRadius: 5,
								padding: "12px 20px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Get API key →
						</button>
						<button
							style={{
								background: "transparent",
								color: "var(--code-fg)",
								border: "1px solid var(--code-dim)",
								borderRadius: 5,
								padding: "12px 20px",
								fontSize: 14,
								fontWeight: 500,
								cursor: "pointer",
								fontFamily: "inherit",
							}}
						>
							Read quickstart
						</button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

window.V3Console = V3Console;
