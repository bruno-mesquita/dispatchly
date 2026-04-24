"use client";

import { useEffect, useRef, useState } from "react";

// ─── Design tokens ───────────────────────────────────────────────────────────

const CSS_VARS = {
	"--bg": "#FAFAF7",
	"--bg-alt": "#F4F2ED",
	"--surface": "#FFFFFF",
	"--fg": "#0E0E0C",
	"--fg-dim": "#76726A",
	"--hairline": "rgba(14, 14, 12, 0.09)",
	"--accent": "#1F4ED8",
	"--accent-tint": "rgba(31, 78, 216, 0.08)",
	"--ok": "#10966B",
	"--warn": "#B87A00",
	"--err": "#C8402B",
	"--code-bg": "#0E100D",
	"--code-bar": "#161814",
	"--code-fg": "#E8E6DF",
	"--code-dim": "rgba(232, 230, 223, 0.45)",
	"--code-kw": "#D66F63",
	"--code-str": "#A8C077",
	"--code-num": "#C9A86A",
	"--code-comment": "#6B6A5F",
	"--code-key": "#7FA8C9",
	"--font-mono": "var(--font-jetbrains-mono), ui-monospace, monospace",
	"--font-serif": "var(--font-instrument-serif), Georgia, serif",
	"--font-sans": "var(--font-geist-sans), ui-sans-serif, sans-serif",
} as Record<string, string>;

// ─── Logo ────────────────────────────────────────────────────────────────────

function DLogo({ size = 22 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			<rect x="2" y="2" width="20" height="20" rx="4" fill="var(--fg)" />
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

function DWordmark({ size = 22 }: { size?: number }) {
	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				color: "var(--fg)",
				letterSpacing: -0.3,
			}}
		>
			<DLogo size={size} />
			<span
				style={{
					fontWeight: 600,
					fontSize: size * 0.82,
					letterSpacing: -0.5,
					fontFamily: "var(--font-sans)",
				}}
			>
				Dispatchly
			</span>
		</div>
	);
}

// ─── PulseDot ────────────────────────────────────────────────────────────────

function PulseDot({
	color = "#00B87C",
	size = 6,
}: {
	color?: string;
	size?: number;
}) {
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

// ─── Log stream ──────────────────────────────────────────────────────────────

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
] as const;

type LogEntry = {
	lvl: string;
	ch: string;
	msg: string;
	ms: number;
	id: number;
	ts: number;
};

function LogStream({
	rows = 8,
	speed = 1100,
}: {
	rows?: number;
	speed?: number;
}) {
	const [log, setLog] = useState<LogEntry[]>(() => {
		const now = Date.now();
		return Array.from({ length: rows }, (_, i) => {
			const s = LOG_SAMPLES[i % LOG_SAMPLES.length];
			return {
				...s,
				ts: now - (rows - i) * speed,
				id: now - (rows - i) * speed,
			};
		});
	});
	const idx = useRef(rows);

	useEffect(() => {
		const t = setInterval(() => {
			const s = LOG_SAMPLES[idx.current % LOG_SAMPLES.length];
			idx.current++;
			setLog((prev) => [
				...prev.slice(-(rows - 1)),
				{ ...s, ts: Date.now(), id: Date.now() + Math.random() },
			]);
		}, speed);
		return () => clearInterval(t);
	}, [rows, speed]);

	const fmt = (ts: number) => new Date(ts).toTimeString().slice(0, 8);
	const lvlColor: Record<string, string> = {
		ok: "var(--ok)",
		warn: "var(--warn)",
		err: "var(--err)",
	};
	const lvlLabel: Record<string, string> = {
		ok: "OK ",
		warn: "WRN",
		err: "ERR",
	};

	return (
		<div
			style={{
				fontFamily: "var(--font-mono)",
				fontSize: 11.5,
				lineHeight: 1.75,
				color: "var(--code-fg)",
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

// ─── Code block ──────────────────────────────────────────────────────────────

const CODE_SAMPLES: Record<string, { code: string; lang: string }> = {
	node: {
		lang: "ts",
		code: `import { Dispatchly } from "@dispatchly/node";

const dx = new Dispatchly({ apiKey: process.env.DX_KEY });

await dx.send({
  to: "user_4821",
  template: "order_confirmed",
  channels: ["email", "push"],
  data: { orderId: "ord_8f2a", total: "$142.00" },
});
// → { id: "msg_9xk2", status: "queued" }`,
	},
	curl: {
		lang: "shell",
		code: `$ curl https://api.dispatchly.io/v1/send \\
  -H "Authorization: Bearer $DX_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user_4821",
    "template": "order_confirmed",
    "channels": ["email", "push"],
    "data": { "orderId": "ord_8f2a" }
  }'`,
	},
	python: {
		lang: "python",
		code: `from dispatchly import Dispatchly

dx = Dispatchly(api_key=os.environ["DX_KEY"])

result = dx.send(
    to="user_4821",
    template="order_confirmed",
    channels=["email", "push"],
    data={"orderId": "ord_8f2a", "total": "$142.00"},
)
# → SendResult(id="msg_9xk2", status="queued")`,
	},
	go: {
		lang: "go",
		code: `client := dispatchly.New(os.Getenv("DX_KEY"))

result, err := client.Send(ctx, &dispatchly.SendParams{
  To:       "user_4821",
  Template: "order_confirmed",
  Channels: []string{"email", "push"},
  Data: map[string]any{
    "orderId": "ord_8f2a",
    "total":   "$142.00",
  },
})
// result.ID = "msg_9xk2"`,
	},
};

type TokenKind = "t" | "k" | "s" | "n" | "c" | "key";

function tokenizeJS(code: string) {
	const patterns: [RegExp, TokenKind][] = [
		[/(\/\/[^\n]*)/g, "c"],
		[/(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, "s"],
		[
			/\b(const|let|var|function|async|await|import|from|export|return|new|if|else|true|false|null|undefined)\b/g,
			"k",
		],
		[/\b([a-zA-Z_]\w*)(?=\s*:)/g, "key"],
		[/\b\d+(\.\d+)?\b/g, "n"],
	];

	return code.split("\n").map((line, i) => {
		let parts: { t: string; k: TokenKind }[] = [{ t: line, k: "t" }];

		for (const [re, kind] of patterns) {
			const next: { t: string; k: TokenKind }[] = [];
			for (const p of parts) {
				if (p.k !== "t") {
					next.push(p);
					continue;
				}
				let last = 0;
				for (const m of p.t.matchAll(re)) {
					const start = m.index ?? 0;
					if (start > last) next.push({ t: p.t.slice(last, start), k: "t" });
					next.push({ t: m[0], k: kind });
					last = start + m[0].length;
				}
				if (last < p.t.length) next.push({ t: p.t.slice(last), k: "t" });
			}
			parts = next;
		}

		const col: Record<TokenKind, string> = {
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

function tokenizeShell(code: string) {
	return code.split("\n").map((line, i) => {
		if (line.startsWith("$"))
			return (
				<div key={i}>
					<span style={{ color: "var(--code-dim)" }}>$</span>
					{line.slice(1)}
				</div>
			);
		if (line.startsWith("#"))
			return (
				<div key={i} style={{ color: "var(--code-comment)" }}>
					{line}
				</div>
			);
		return <div key={i}>{line || " "}</div>;
	});
}

function CodeBlock({
	code,
	lang,
	tabs,
	activeTab,
	onTab,
}: {
	code: string;
	lang: string;
	tabs?: string[];
	activeTab?: string;
	onTab?: (t: string) => void;
}) {
	const tokens = lang === "shell" ? tokenizeShell(code) : tokenizeJS(code);
	return (
		<div
			style={{
				background: "var(--code-bg)",
				color: "var(--code-fg)",
				fontFamily: "var(--font-mono)",
				fontSize: 12.5,
				lineHeight: 1.7,
				borderRadius: 6,
				border: "1px solid var(--hairline)",
				overflow: "hidden",
			}}
		>
			{tabs && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						borderBottom: "1px solid var(--hairline)",
						background: "var(--code-bar)",
					}}
				>
					{tabs.map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => onTab?.(t)}
							style={{
								border: "none",
								background: "transparent",
								cursor: "pointer",
								padding: "8px 14px",
								fontFamily: "var(--font-mono)",
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
					))}
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
			<div style={{ padding: "14px 16px" }}>
				<pre style={{ margin: 0, fontFamily: "inherit", whiteSpace: "pre" }}>
					{tokens}
				</pre>
			</div>
		</div>
	);
}

// ─── Kicker label ────────────────────────────────────────────────────────────

function Kicker({ num, label }: { num: string; label: string }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				fontFamily: "var(--font-mono)",
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
		</div>
	);
}

// ─── Journey diagram ─────────────────────────────────────────────────────────

function JourneyNode({
	type,
	title,
	sub,
	highlight = false,
}: {
	type: string;
	title: string;
	sub?: string;
	highlight?: boolean;
}) {
	const icons: Record<string, React.ReactNode> = {
		trigger: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				aria-hidden="true"
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
				aria-hidden="true"
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
				aria-hidden="true"
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
				aria-hidden="true"
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
				aria-hidden="true"
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
				aria-hidden="true"
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
				padding: "10px 12px",
				minWidth: 150,
				display: "flex",
				flexDirection: "column",
				gap: 2,
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
				{type === "trigger" && (
					<span style={{ marginLeft: "auto" }}>
						<PulseDot color="var(--ok)" size={5} />
					</span>
				)}
			</div>
			<div
				style={{
					fontSize: 13,
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
						fontFamily: "var(--font-mono)",
					}}
				>
					{sub}
				</div>
			)}
		</div>
	);
}

function ArrowDown() {
	return (
		<svg
			width="10"
			height="20"
			viewBox="0 0 10 20"
			fill="none"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			<path
				d="M5 0v16M1 13l4 4 4-4"
				stroke="var(--fg-dim)"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function JourneyDiagram() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 6,
				padding: "24px 20px",
				background: "var(--bg-alt)",
				borderRadius: 8,
				border: "1px solid var(--hairline)",
			}}
		>
			<JourneyNode
				type="trigger"
				title="user.signup"
				sub="server event"
				highlight
			/>
			<ArrowDown />
			<JourneyNode
				type="email"
				title="Welcome email"
				sub="template: welcome_v3"
			/>
			<ArrowDown />
			<JourneyNode type="wait" title="Wait 3 days" sub="check: opened?" />
			<ArrowDown />
			<JourneyNode type="branch" title="Not opened?" sub="if opened = false" />
			<div
				style={{
					display: "flex",
					gap: 16,
					alignItems: "flex-start",
					marginTop: 4,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
					}}
				>
					<div
						style={{
							fontSize: 9.5,
							fontFamily: "var(--font-mono)",
							color: "var(--fg-dim)",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						yes
					</div>
					<JourneyNode type="sms" title="Reminder SMS" />
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
					}}
				>
					<div
						style={{
							fontSize: 9.5,
							fontFamily: "var(--font-mono)",
							color: "var(--fg-dim)",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						no
					</div>
					<JourneyNode type="push" title="Push nudge" />
				</div>
			</div>
		</div>
	);
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
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
					href="/login"
					style={{ color: "var(--fg-dim)", textDecoration: "none" }}
				>
					Sign in
				</a>
				<button
					type="button"
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
					}}
				>
					Start free →
				</button>
			</div>
		</nav>
	);
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
	const [activeTab, setActiveTab] = useState("node");
	const sample = CODE_SAMPLES[activeTab];

	return (
		<section
			style={{
				padding: "80px 40px 60px",
				borderBottom: "1px solid var(--hairline)",
				background: "var(--bg)",
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
						"linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
					WebkitMaskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
					maskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
				}}
			/>
			<div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						fontFamily: "var(--font-mono)",
						fontSize: 11,
						color: "var(--fg-dim)",
						textTransform: "uppercase",
						letterSpacing: 0.8,
						marginBottom: 28,
					}}
				>
					<span style={{ color: "var(--accent)" }}>01</span>
					<span style={{ width: 18, height: 1, background: "var(--accent)" }} />
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
						color: "var(--fg)",
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
						color: "var(--fg-dim)",
						maxWidth: 480,
						lineHeight: 1.55,
						margin: "0 0 36px",
					}}
				>
					Email, SMS, and push from a single endpoint. Journeys, transactional,
					and broadcast — observable by default.
				</p>
				<div style={{ display: "flex", gap: 10, marginBottom: 56 }}>
					<button
						type="button"
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
						}}
					>
						Start free →
					</button>
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
						View docs
					</button>
				</div>

				<div
					style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}
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

// ─── Logo bar ─────────────────────────────────────────────────────────────────

function LogoBar() {
	return (
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
					fontFamily: "var(--font-mono)",
					fontSize: 11,
					color: "var(--fg-dim)",
				}}
			>
				<span
					style={{
						textTransform: "uppercase",
						letterSpacing: 0.8,
						whiteSpace: "nowrap",
					}}
				>
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
	);
}

// ─── Feature strip ────────────────────────────────────────────────────────────

const FEATURES = [
	{
		title: "Multi-channel",
		sub: "email · sms · push",
		desc: "Send anywhere your users are. One API. One SDK.",
	},
	{
		title: "Journeys",
		sub: "trigger → wait → branch",
		desc: "Orchestrate flows without a CDP. Versioned in git.",
	},
	{
		title: "Observability",
		sub: "trace every send",
		desc: "Per-user, per-template, per-device logs. Search by anything.",
	},
	{
		title: "Deliverability",
		sub: "SPF · DKIM · DMARC",
		desc: "Dedicated IPs, auto-warming, reputation monitoring.",
	},
] as const;

function FeatureStrip() {
	return (
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
				{FEATURES.map((f, i) => (
					<div
						key={f.title}
						style={{
							padding: "28px 24px",
							borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
						}}
					>
						<div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
							{f.title}
						</div>
						<div
							style={{
								fontSize: 11,
								fontFamily: "var(--font-mono)",
								color: "var(--fg-dim)",
								marginTop: 4,
							}}
						>
							{f.sub}
						</div>
						<div
							style={{
								fontSize: 13,
								color: "var(--fg-dim)",
								marginTop: 10,
								lineHeight: 1.5,
							}}
						>
							{f.desc}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

// ─── Journeys feature ─────────────────────────────────────────────────────────

function JourneysFeature() {
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
										{t}
									</div>
									<div
										style={{
											fontSize: 12,
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
				<JourneyDiagram />
			</div>
		</section>
	);
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatsRow() {
	return (
		<section
			style={{
				padding: "70px 40px",
				borderBottom: "1px solid var(--hairline)",
				background: "var(--bg-alt)",
			}}
		>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						borderTop: "1px solid var(--hairline)",
						borderBottom: "1px solid var(--hairline)",
					}}
				>
					{(
						[
							["99.998%", "uptime · 90d", "us-east-1 · eu-west-1 · ap-south-1"],
							["47ms", "p99 API latency", "from your backend to the queue"],
							["2.4B", "dispatches / month", "across every plan"],
						] as const
					).map(([n, l, s], i) => (
						<div
							key={l}
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
									color: "var(--fg)",
								}}
							>
								{n}
							</div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 500,
									color: "var(--fg)",
									marginTop: 8,
								}}
							>
								{l}
							</div>
							<div
								style={{
									fontSize: 11,
									fontFamily: "var(--font-mono)",
									color: "var(--fg-dim)",
									marginTop: 4,
								}}
							>
								{s}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

function Testimonial() {
	return (
		<section
			style={{
				padding: "70px 40px",
				borderBottom: "1px solid var(--hairline)",
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
						color: "var(--fg)",
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
							border: "1px solid var(--hairline)",
						}}
					>
						MR
					</div>
					<div>
						<div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>
							Maya Rao
						</div>
						<div
							style={{
								fontSize: 12,
								color: "var(--fg-dim)",
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

// ─── Pricing ─────────────────────────────────────────────────────────────────

const PLANS = [
	{
		name: "Free",
		price: "$0",
		sub: "up to 10k/mo",
		feat: ["All 3 channels", "1 journey", "Community support"],
		hi: false,
	},
	{
		name: "Scale",
		price: "$49",
		sub: "per million",
		feat: ["Unlimited journeys", "A/B testing", "Priority routing", "SSO"],
		hi: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		sub: "high-volume",
		feat: ["Dedicated IPs", "Custom SLA", "HIPAA BAA", "On-prem queue"],
		hi: false,
	},
] as const;

function Pricing() {
	return (
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
							color: "var(--fg)",
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
						{PLANS.map((p) => (
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
								<div
									style={{
										fontSize: 12,
										fontFamily: "var(--font-mono)",
										textTransform: "uppercase",
										letterSpacing: 0.6,
										opacity: 0.7,
									}}
								>
									{p.name}
								</div>
								<div>
									<span
										style={{
											fontSize: 32,
											fontWeight: 500,
											letterSpacing: -0.8,
										}}
									>
										{p.price}
									</span>
									<span
										style={{
											fontSize: 12,
											marginLeft: 6,
											opacity: 0.6,
											fontFamily: "var(--font-mono)",
										}}
									>
										{p.sub}
									</span>
								</div>
								<div
									style={{
										height: 1,
										background: p.hi
											? "rgba(250,250,247,0.15)"
											: "var(--hairline)",
									}}
								/>
								<div
									style={{ display: "flex", flexDirection: "column", gap: 6 }}
								>
									{p.feat.map((f) => (
										<div
											key={f}
											style={{
												fontSize: 13,
												display: "flex",
												gap: 8,
												alignItems: "flex-start",
											}}
										>
											<span style={{ opacity: 0.5, flexShrink: 0 }}>→</span>
											<span>{f}</span>
										</div>
									))}
								</div>
								<button
									type="button"
									style={{
										marginTop: "auto",
										background: p.hi ? "var(--bg)" : "var(--fg)",
										color: p.hi ? "var(--fg)" : "var(--bg)",
										border: "none",
										borderRadius: 5,
										padding: "9px 14px",
										fontSize: 13,
										fontWeight: 500,
										cursor: "pointer",
										fontFamily: "var(--font-sans)",
									}}
								>
									{p.name === "Enterprise" ? "Contact sales" : "Get started"}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTA() {
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
					<button
						type="button"
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
						}}
					>
						Start free →
					</button>
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

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_COLS: ReadonlyArray<readonly [string, readonly string[]]> = [
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

function Footer() {
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
							fontFamily: "var(--font-mono)",
							fontSize: 10.5,
							color: "var(--fg-dim)",
						}}
					>
						{["SOC 2", "GDPR", "HIPAA"].map((b) => (
							<span
								key={b}
								style={{
									padding: "3px 7px",
									border: "1px solid var(--hairline)",
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
								color: "var(--fg-dim)",
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
									key={it}
									href="/"
									style={{ color: "var(--fg)", textDecoration: "none" }}
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
					maxWidth: 1200,
					margin: "56px auto 0",
					paddingTop: 20,
					borderTop: "1px solid var(--hairline)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: 11.5,
					color: "var(--fg-dim)",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
	return (
		<div
			style={
				{
					...CSS_VARS,
					fontFamily: "var(--font-sans)",
					background: "var(--bg)",
					color: "var(--fg)",
					WebkitFontSmoothing: "antialiased",
				} as React.CSSProperties
			}
		>
			<style>{`
				@keyframes dpl-ping {
					0% { transform: scale(0.8); opacity: 0.6; }
					80%, 100% { transform: scale(2.4); opacity: 0; }
				}
				@keyframes dpl-fadein {
					from { opacity: 0; transform: translateY(3px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
			<Nav />
			<Hero />
			<LogoBar />
			<FeatureStrip />
			<JourneysFeature />
			<StatsRow />
			<Testimonial />
			<Pricing />
			<CTA />
			<Footer />
		</div>
	);
}
