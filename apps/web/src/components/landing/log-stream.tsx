import { useEffect, useRef, useState } from "react";

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

export function LogStream({
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
