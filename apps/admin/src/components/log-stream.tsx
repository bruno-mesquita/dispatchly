"use client";

import { useEffect, useState } from "react";
import { PulseDot } from "./pulse-dot";
import { cn } from "@dispatchly/ui/lib/utils";

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

interface LogEntry {
	id: number;
	ts: number;
	lvl: string;
	ch: string;
	msg: string;
	ms: number;
}

export function LogStream({ rows = 20, speed = 1200, className = "" }) {
	const [log, setLog] = useState<LogEntry[]>([]);

	useEffect(() => {
		// Initial seed
		const now = Date.now();
		const initial = Array.from({ length: rows }).map((_, i) => {
			const s = LOG_SAMPLES[i % LOG_SAMPLES.length];
			return {
				...s,
				ts: now - (rows - i) * speed,
				id: now - (rows - i) * speed + Math.random(),
			};
		});
		setLog(initial);

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

	const fmt = (ts: number) => {
		const d = new Date(ts);
		return d.toTimeString().slice(0, 8);
	};

	const lvlColor = {
		ok: "text-green-500",
		warn: "text-orange-500",
		err: "text-red-500",
	};

	return (
		<div
			className={cn(
				"font-mono text-[11px] leading-relaxed text-code-fg",
				className,
			)}
		>
			{log.map((r) => (
				<div
					key={r.id}
					className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
				>
					<span className="text-muted-foreground/50 tabular-nums shrink-0">
						{fmt(r.ts)}
					</span>
					<span
						className={cn(
							"font-bold uppercase w-6 shrink-0",
							lvlColor[r.lvl as keyof typeof lvlColor],
						)}
					>
						{r.lvl.toUpperCase().slice(0, 3)}
					</span>
					<span className="text-muted-foreground/60 uppercase w-10 shrink-0 tracking-tighter">
						{r.ch}
					</span>
					<span className="flex-1 truncate opacity-90">{r.msg}</span>
					<span className="text-muted-foreground/40 tabular-nums shrink-0">
						{r.ms}ms
					</span>
				</div>
			))}
		</div>
	);
}
