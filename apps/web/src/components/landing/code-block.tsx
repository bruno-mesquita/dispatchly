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

export function CodeBlock({
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
				border: "1px solid var(--border)",
				overflow: "hidden",
			}}
		>
			{tabs && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						borderBottom: "1px solid var(--border)",
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
								borderRight: "1px solid var(--border)",
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

export { CODE_SAMPLES };
