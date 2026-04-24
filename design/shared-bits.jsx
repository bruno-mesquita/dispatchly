// Shared bits for all 3 Dispatchly landing variants.
// Logo, nav, footer, code blocks, log streams, journey diagram, counters, charts.

// ───────────────────────── Logo ─────────────────────────
function DLogo({ size = 22, color = "currentColor" }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			style={{ flexShrink: 0 }}
		>
			<rect x="2" y="2" width="20" height="20" rx="4" fill={color} />
			<path
				d="M7 8.5 L11 12 L7 15.5"
				stroke="#FAFAF7"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M13 8.5 L17 12 L13 15.5"
				stroke="#FAFAF7"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				opacity="0.55"
			/>
		</svg>
	);
}

function DWordmark({ size = 22, color = "currentColor" }) {
	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				color,
				letterSpacing: -0.3,
			}}
		>
			<DLogo size={size} color={color} />
			<span
				style={{ fontWeight: 600, fontSize: size * 0.82, letterSpacing: -0.5 }}
			>
				Dispatchly
			</span>
		</div>
	);
}

// ───────────────────────── Counter ─────────────────────────
// Animates a number toward `target` with a settle delay.
function useCount(target, { duration = 1400, start = 0 } = {}) {
	const [v, setV] = React.useState(start);
	React.useEffect(() => {
		let raf, t0;
		const tick = (t) => {
			if (!t0) t0 = t;
			const p = Math.min(1, (t - t0) / duration);
			const eased = 1 - (1 - p) ** 3;
			setV(start + (target - start) * eased);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, duration, start]);
	return v;
}

function Count({ to, decimals = 0, prefix = "", suffix = "", format }) {
	const v = useCount(to);
	const n = decimals === 0 ? Math.round(v) : v.toFixed(decimals);
	const formatted = format
		? format(Number(n))
		: Number(n).toLocaleString("en-US");
	return (
		<span style={{ fontVariantNumeric: "tabular-nums" }}>
			{prefix}
			{formatted}
			{suffix}
		</span>
	);
}

// ───────────────────────── Live pulse dot ─────────────────────────
function PulseDot({ color = "#00B87C", size = 6 }) {
	return (
		<span
			style={{
				position: "relative",
				display: "inline-flex",
				width: size,
				height: size,
			}}
		>
			<span
				style={{
					position: "absolute",
					inset: 0,
					borderRadius: "50%",
					background: color,
					animation: "dpl-ping 1.8s ease-out infinite",
					opacity: 0.4,
				}}
			/>
			<span
				style={{
					position: "relative",
					width: size,
					height: size,
					borderRadius: "50%",
					background: color,
				}}
			/>
		</span>
	);
}

// ───────────────────────── Code Block ─────────────────────────
// Minimal mono code block w/ basic syntax tokens.
function tokenize(code, lang) {
	// very light tokenizer — good enough to look real
	if (lang === "shell") {
		return code.split("\n").map((line, i) => {
			if (line.startsWith("$")) {
				return (
					<div key={i}>
						<span style={{ color: "var(--code-dim)" }}>$</span>
						{line.slice(1)}
					</div>
				);
			}
			if (line.startsWith("#")) {
				return (
					<div key={i} style={{ color: "var(--code-comment)" }}>
						{line}
					</div>
				);
			}
			return <div key={i}>{line || "\u00A0"}</div>;
		});
	}
	// js / ts / json
	const kw =
		/\b(const|let|var|function|async|await|import|from|export|return|new|if|else|true|false|null)\b/g;
	const str = /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g;
	const num = /\b\d+(\.\d+)?\b/g;
	const com = /(\/\/[^\n]*)/g;
	const key = /\b([a-zA-Z_]\w*)(?=\s*:)/g;
	return code.split("\n").map((line, i) => {
		let parts = [{ t: line, k: "t" }];
		const split = (re, kind) => {
			const out = [];
			for (const p of parts) {
				if (p.k !== "t") {
					out.push(p);
					continue;
				}
				let last = 0;
				let m;
				re.lastIndex = 0;
				while ((m = re.exec(p.t)) !== null) {
					if (m.index > last) out.push({ t: p.t.slice(last, m.index), k: "t" });
					out.push({ t: m[0], k: kind });
					last = m.index + m[0].length;
				}
				if (last < p.t.length) out.push({ t: p.t.slice(last), k: "t" });
			}
			parts = out;
		};
		split(com, "c");
		split(str, "s");
		split(kw, "k");
		split(key, "key");
		split(num, "n");
		const col = {
			t: "var(--code-fg)",
			k: "var(--code-kw)",
			s: "var(--code-str)",
			n: "var(--code-num)",
			c: "var(--code-comment)",
			key: "var(--code-key)",
		};
		return (
			<div key={i}>
				{parts.map((p, j) => (
					<span key={j} style={{ color: col[p.k] }}>
						{p.t}
					</span>
				))}
				{line === "" && <span>&nbsp;</span>}
			</div>
		);
	});
}

function CodeBlock({
	code,
	lang = "js",
	showLineNumbers = false,
	tabs,
	activeTab,
	onTab,
	style = {},
	filename,
}) {
	const lines = code.split("\n");
	return (
		<div
			style={{
				background: "var(--code-bg)",
				color: "var(--code-fg)",
				fontFamily: '"JetBrains Mono", ui-monospace, monospace',
				fontSize: 12.5,
				lineHeight: 1.7,
				borderRadius: 6,
				border: "1px solid var(--hairline)",
				overflow: "hidden",
				...style,
			}}
		>
			{(tabs || filename) && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						borderBottom: "1px solid var(--hairline)",
						background: "var(--code-bar)",
					}}
				>
					{tabs ? (
						tabs.map((t) => (
							<button
								key={t}
								onClick={() => onTab && onTab(t)}
								style={{
									border: "none",
									background: "transparent",
									cursor: "pointer",
									padding: "8px 14px",
									fontFamily: "inherit",
									fontSize: 11.5,
									color: t === activeTab ? "var(--code-fg)" : "var(--code-dim)",
									borderRight: "1px solid var(--hairline)",
									borderBottom:
										t === activeTab
											? "1px solid var(--accent)"
											: "1px solid transparent",
									marginBottom: -1,
								}}
							>
								{t}
							</button>
						))
					) : (
						<div
							style={{
								padding: "8px 14px",
								fontSize: 11.5,
								color: "var(--code-dim)",
							}}
						>
							{filename}
						</div>
					)}
					<div style={{ flex: 1 }} />
					<div
						style={{
							padding: "0 12px",
							fontSize: 10.5,
							color: "var(--code-dim)",
							letterSpacing: 0.4,
							textTransform: "uppercase",
						}}
					>
						{lang}
					</div>
				</div>
			)}
			<div style={{ padding: "14px 16px", display: "flex" }}>
				{showLineNumbers && (
					<div
						style={{
							color: "var(--code-dim)",
							paddingRight: 14,
							userSelect: "none",
							textAlign: "right",
						}}
					>
						{lines.map((_, i) => (
							<div key={i}>{i + 1}</div>
						))}
					</div>
				)}
				<pre
					style={{
						margin: 0,
						flex: 1,
						fontFamily: "inherit",
						whiteSpace: "pre",
					}}
				>
					{tokenize(code, lang)}
				</pre>
			</div>
		</div>
	);
}

// ───────────────────────── Log Stream ─────────────────────────
// Streaming event log w/ timestamps and status pills.
const LOG_SAMPLES = [
	{ lvl: "ok", ch: "email", msg: "delivered · user_4821@acme.co", ms: 142 },
	{ lvl: "ok", ch: "sms", msg: "delivered · +1 (415) 555-0133", ms: 89 },
	{ lvl: "ok", ch: "push", msg: "delivered · iOS · device_8a2f", ms: 51 },
	{ lvl: "ok", ch: "email", msg: "opened · user_3392@loop.io", ms: 1840 },
	{ lvl: "ok", ch: "email", msg: "clicked · cta_upgrade", ms: 220 },
	{ lvl: "warn", ch: "email", msg: "soft_bounce · mailbox_full", ms: 312 },
	{ lvl: "ok", ch: "push", msg: "delivered · Android · device_c71e", ms: 44 },
	{ lvl: "ok", ch: "sms", msg: "delivered · +44 20 7946 0718", ms: 108 },
	{ lvl: "err", ch: "email", msg: "suppressed · unsubscribed_list", ms: 8 },
	{ lvl: "ok", ch: "email", msg: "delivered · user_1190@stripe.dev", ms: 167 },
	{ lvl: "ok", ch: "push", msg: "opened · device_4f19", ms: 920 },
	{ lvl: "ok", ch: "sms", msg: "delivered · +55 11 99876-5432", ms: 134 },
];

function LogStream({ rows = 8, speed = 900, style = {}, compact = false }) {
	const [log, setLog] = React.useState(() => {
		// seed with initial rows
		const out = [];
		const now = Date.now();
		for (let i = 0; i < rows; i++) {
			const s = LOG_SAMPLES[i % LOG_SAMPLES.length];
			out.push({
				...s,
				ts: now - (rows - i) * speed,
				id: now - (rows - i) * speed,
			});
		}
		return out;
	});

	React.useEffect(() => {
		let i = rows;
		const t = setInterval(() => {
			setLog((prev) => {
				const s = LOG_SAMPLES[i % LOG_SAMPLES.length];
				i++;
				const next = [
					...prev.slice(-(rows - 1)),
					{ ...s, ts: Date.now(), id: Date.now() + Math.random() },
				];
				return next;
			});
		}, speed);
		return () => clearInterval(t);
	}, [rows, speed]);

	const fmt = (ts) => {
		const d = new Date(ts);
		return d.toTimeString().slice(0, 8);
	};
	const lvlColor = { ok: "var(--ok)", warn: "var(--warn)", err: "var(--err)" };
	const lvlLabel = { ok: "OK ", warn: "WRN", err: "ERR" };

	return (
		<div
			style={{
				fontFamily: '"JetBrains Mono", ui-monospace, monospace',
				fontSize: compact ? 10.5 : 11.5,
				lineHeight: compact ? 1.6 : 1.75,
				color: "var(--code-fg)",
				...style,
			}}
		>
			{log.map((r) => (
				<div
					key={r.id}
					style={{
						display: "flex",
						gap: 10,
						animation: "dpl-fadein .35s ease-out",
					}}
				>
					<span style={{ color: "var(--code-dim)", whiteSpace: "nowrap" }}>
						{fmt(r.ts)}
					</span>
					<span style={{ color: lvlColor[r.lvl], fontWeight: 600 }}>
						{lvlLabel[r.lvl]}
					</span>
					<span
						style={{
							color: "var(--code-dim)",
							textTransform: "uppercase",
							letterSpacing: 0.5,
							minWidth: 40,
						}}
					>
						{r.ch}
					</span>
					<span
						style={{
							color: "var(--code-fg)",
							flex: 1,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{r.msg}
					</span>
					<span style={{ color: "var(--code-dim)", whiteSpace: "nowrap" }}>
						{r.ms}ms
					</span>
				</div>
			))}
		</div>
	);
}

// ───────────────────────── Journey Diagram ─────────────────────────
// Visual flow: trigger → email → wait → branch → sms / push
function JourneyNode({
	type,
	title,
	sub,
	status = "live",
	highlight = false,
	compact = false,
}) {
	const icons = {
		trigger: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<path d="M7 1v6l4 2" />
				<circle cx="7" cy="7" r="6" />
			</svg>
		),
		email: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<rect x="1" y="3" width="12" height="8" rx="1" />
				<path d="M1 4l6 4 6-4" />
			</svg>
		),
		wait: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<circle cx="7" cy="7" r="6" />
				<path d="M7 4v3l2 2" />
			</svg>
		),
		branch: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<path d="M3 1v4M11 1v4M3 5a4 4 0 007 0M7 8v5" />
			</svg>
		),
		sms: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<path d="M1 3h12v7H6l-3 3v-3H1z" />
			</svg>
		),
		push: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				<rect x="3" y="1" width="8" height="12" rx="1.5" />
				<path d="M6 10.5h2" />
			</svg>
		),
	};
	return (
		<div
			style={{
				background: highlight ? "var(--accent-tint)" : "var(--surface)",
				border:
					"1px solid " + (highlight ? "var(--accent)" : "var(--hairline)"),
				borderRadius: 6,
				padding: compact ? "8px 10px" : "10px 12px",
				minWidth: compact ? 130 : 160,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				position: "relative",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					color: highlight ? "var(--accent)" : "var(--fg-dim)",
				}}
			>
				{icons[type]}
				<span
					style={{
						fontSize: 10,
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: 0.6,
						color: "var(--fg-dim)",
					}}
				>
					{type}
				</span>
				{status === "live" && (
					<span style={{ marginLeft: "auto", display: "inline-flex" }}>
						<PulseDot color="var(--ok)" size={5} />
					</span>
				)}
			</div>
			<div
				style={{
					fontSize: compact ? 12 : 13,
					fontWeight: 500,
					color: "var(--fg)",
					marginTop: 2,
				}}
			>
				{title}
			</div>
			{sub && (
				<div
					style={{
						fontSize: 10.5,
						color: "var(--fg-dim)",
						fontFamily: '"JetBrains Mono", monospace',
					}}
				>
					{sub}
				</div>
			)}
		</div>
	);
}

function JourneyConnector({ label, vertical = false }) {
	if (vertical) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: 28,
					color: "var(--fg-dim)",
				}}
			>
				<svg width="10" height="24" viewBox="0 0 10 24" fill="none">
					<path
						d="M5 0v20M1 17l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
				</svg>
				{label && (
					<div
						style={{
							fontSize: 9.5,
							fontFamily: '"JetBrains Mono", monospace',
							textTransform: "uppercase",
							letterSpacing: 0.5,
							marginTop: 2,
						}}
					>
						{label}
					</div>
				)}
			</div>
		);
	}
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				padding: "0 6px",
				color: "var(--fg-dim)",
			}}
		>
			<svg width="30" height="10" viewBox="0 0 30 10" fill="none">
				<path
					d="M0 5h24M21 1l4 4-4 4"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
				/>
			</svg>
			{label && (
				<div
					style={{
						fontSize: 9.5,
						fontFamily: '"JetBrains Mono", monospace',
						textTransform: "uppercase",
						letterSpacing: 0.5,
						marginLeft: 4,
					}}
				>
					{label}
				</div>
			)}
		</div>
	);
}

// ───────────────────────── Sparkline / Chart ─────────────────────────
function Sparkline({
	data,
	width = 120,
	height = 32,
	color = "var(--accent)",
	fill = false,
}) {
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const pts = data.map((d, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - ((d - min) / range) * (height - 4) - 2;
		return [x, y];
	});
	const path = "M" + pts.map((p) => p.join(",")).join(" L");
	const area = path + ` L${width},${height} L0,${height} Z`;
	return (
		<svg width={width} height={height} style={{ display: "block" }}>
			{fill && <path d={area} fill={color} opacity={0.12} />}
			<path
				d={path}
				stroke={color}
				strokeWidth={1.5}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function AreaChart({
	data,
	width = 600,
	height = 160,
	color = "var(--accent)",
}) {
	const max = Math.max(...data);
	const pts = data.map((d, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - (d / max) * (height - 20) - 10;
		return [x, y];
	});
	const path = "M" + pts.map((p) => p.join(",")).join(" L");
	const area = path + ` L${width},${height} L0,${height} Z`;
	return (
		<svg
			width="100%"
			viewBox={`0 0 ${width} ${height}`}
			style={{ display: "block" }}
		>
			<defs>
				<linearGradient id="ac-grad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.18" />
					<stop offset="100%" stopColor={color} stopOpacity="0" />
				</linearGradient>
			</defs>
			{/* gridlines */}
			{[0.25, 0.5, 0.75].map((f) => (
				<line
					key={f}
					x1="0"
					x2={width}
					y1={height * f}
					y2={height * f}
					stroke="var(--hairline)"
					strokeDasharray="2 4"
				/>
			))}
			<path d={area} fill="url(#ac-grad)" />
			<path d={path} stroke={color} strokeWidth="1.5" fill="none" />
		</svg>
	);
}

// ───────────────────────── Stat Card ─────────────────────────
function StatCard({ label, value, delta, spark, suffix }) {
	return (
		<div
			style={{
				background: "var(--surface)",
				border: "1px solid var(--hairline)",
				borderRadius: 6,
				padding: "14px 16px",
				display: "flex",
				flexDirection: "column",
				gap: 6,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					fontSize: 11,
					color: "var(--fg-dim)",
					textTransform: "uppercase",
					letterSpacing: 0.6,
					fontFamily: '"JetBrains Mono", monospace',
				}}
			>
				<span>{label}</span>
				{delta != null && (
					<span style={{ color: delta >= 0 ? "var(--ok)" : "var(--err)" }}>
						{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
					</span>
				)}
			</div>
			<div
				style={{
					fontSize: 24,
					fontWeight: 500,
					letterSpacing: -0.5,
					color: "var(--fg)",
				}}
			>
				{value}
				{suffix && (
					<span style={{ fontSize: 14, color: "var(--fg-dim)", marginLeft: 2 }}>
						{suffix}
					</span>
				)}
			</div>
			{spark && <Sparkline data={spark} width={180} height={28} fill />}
		</div>
	);
}

// ───────────────────────── Nav ─────────────────────────
function NavBar({ variant = "light", cta = "Start free" }) {
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
				<a
					style={{
						color: "inherit",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Product
				</a>
				<a
					style={{
						color: "inherit",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Docs
				</a>
				<a
					style={{
						color: "inherit",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Pricing
				</a>
				<a
					style={{
						color: "inherit",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Changelog
				</a>
				<a
					style={{
						color: "inherit",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Customers
				</a>
			</div>
			<div
				style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}
			>
				<a
					style={{
						color: "var(--fg-dim)",
						textDecoration: "none",
						cursor: "pointer",
					}}
				>
					Sign in
				</a>
				<button
					style={{
						background: "var(--fg)",
						color: "var(--bg)",
						border: "none",
						borderRadius: 5,
						padding: "7px 14px",
						fontSize: 13,
						fontWeight: 500,
						cursor: "pointer",
						fontFamily: "inherit",
					}}
				>
					{cta} →
				</button>
			</div>
		</nav>
	);
}

// ───────────────────────── Footer ─────────────────────────
function Footer() {
	const cols = [
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
							fontFamily: '"JetBrains Mono", monospace',
							fontSize: 10.5,
							color: "var(--fg-dim)",
						}}
					>
						<span
							style={{
								padding: "3px 7px",
								border: "1px solid var(--hairline)",
								borderRadius: 4,
							}}
						>
							SOC 2
						</span>
						<span
							style={{
								padding: "3px 7px",
								border: "1px solid var(--hairline)",
								borderRadius: 4,
							}}
						>
							GDPR
						</span>
						<span
							style={{
								padding: "3px 7px",
								border: "1px solid var(--hairline)",
								borderRadius: 4,
							}}
						>
							HIPAA
						</span>
					</div>
				</div>
				{cols.map(([title, items]) => (
					<div key={title}>
						<div
							style={{
								fontSize: 11,
								color: "var(--fg-dim)",
								textTransform: "uppercase",
								letterSpacing: 0.8,
								fontFamily: '"JetBrains Mono", monospace',
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
									style={{
										color: "var(--fg)",
										textDecoration: "none",
										cursor: "pointer",
									}}
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
					marginTop: 56,
					paddingTop: 20,
					borderTop: "1px solid var(--hairline)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: 11.5,
					color: "var(--fg-dim)",
					fontFamily: '"JetBrains Mono", monospace',
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

// ───────────────────────── Section Kicker ─────────────────────────
function Kicker({ num, label, children }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				fontFamily: '"JetBrains Mono", monospace',
				fontSize: 11,
				color: "var(--fg-dim)",
				textTransform: "uppercase",
				letterSpacing: 0.8,
				marginBottom: 14,
			}}
		>
			<span style={{ color: "var(--accent)" }}>{num}</span>
			<span
				style={{
					width: 18,
					height: 1,
					background: "var(--fg-dim)",
					opacity: 0.5,
				}}
			/>
			<span>{label}</span>
			{children}
		</div>
	);
}

Object.assign(window, {
	DLogo,
	DWordmark,
	NavBar,
	Footer,
	Count,
	useCount,
	PulseDot,
	CodeBlock,
	LogStream,
	JourneyNode,
	JourneyConnector,
	Sparkline,
	AreaChart,
	StatCard,
	Kicker,
});
