"use client";

import { CTA, Footer, Kicker, LogoBar, Nav } from "@/components/landing";

const CASE_STUDIES = [
	{
		company: "Linear",
		metric: "99.9% uptime",
		quote:
			"We needed a messaging layer that could keep up with our pace. Dispatchly's reliability is unmatched.",
		author: "Engineering Team",
		stats: [
			{ l: "Dispatches/mo", v: "15M+" },
			{ l: "Avg Latency", v: "42ms" },
		],
	},
	{
		company: "Vercel",
		metric: "Global Scale",
		quote:
			"Orchestrating notifications across the globe was a nightmare before Dispatchly. Now it's a single API call.",
		author: "Platform Team",
		stats: [
			{ l: "Regions", v: "14" },
			{ l: "Setup time", v: "4 mins" },
		],
	},
	{
		company: "Attio",
		metric: "CRM Sync",
		quote:
			"The ability to branch journeys based on CRM traits directly in Dispatchly saved us months of custom code.",
		author: "Product Team",
		stats: [
			{ l: "Traits synced", v: "1.2k" },
			{ l: "Complexity reduction", v: "70%" },
		],
	},
];

export default function CustomersPage() {
	return (
		<div className="bg-background font-sans text-foreground antialiased">
			<Nav />

			<section className="relative overflow-hidden border-border border-b bg-background px-10 pt-40 pb-20">
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
				<div className="relative mx-auto max-w-[1200px] text-center">
					<Kicker num="01" label="Customers" />
					<h1 className="mx-auto mb-8 max-w-[800px] font-medium text-7xl text-foreground leading-[0.98] tracking-tight">
						Trusted by the{" "}
						<span className="font-normal font-serif italic">best teams.</span>
					</h1>
					<p className="mx-auto max-w-[520px] text-lg text-muted-foreground leading-relaxed">
						From solo founders to global platforms, Dispatchly powers the
						notifications that keep users engaged.
					</p>
				</div>
			</section>

			<LogoBar />

			<section className="border-border border-b bg-background px-10 py-20">
				<div className="mx-auto max-w-[1200px] space-y-32">
					{CASE_STUDIES.map((cs, i) => (
						<div
							key={cs.company}
							className={`grid grid-cols-[1.2fr_1fr] items-center gap-20 ${i % 2 === 1 ? "direction-rtl" : ""}`}
						>
							<div className={i % 2 === 1 ? "order-2" : ""}>
								<div className="mb-4 font-mono text-[11px] text-accent uppercase tracking-wider">
									{cs.metric}
								</div>
								<h2 className="mb-8 font-medium text-4xl text-foreground tracking-tight">
									{cs.company}
								</h2>
								<blockquote className="mb-8 font-normal font-serif text-3xl text-foreground italic leading-snug">
									&ldquo;{cs.quote}&rdquo;
								</blockquote>
								<div className="font-mono text-muted-foreground text-sm">
									{cs.author}
								</div>
							</div>

							<div
								className={`grid grid-cols-2 gap-8 rounded-lg border border-border bg-secondary p-10 ${i % 2 === 1 ? "order-1" : ""}`}
							>
								{cs.stats.map((s) => (
									<div key={s.l}>
										<div className="mb-2 font-medium text-4xl text-foreground tracking-tight">
											{s.v}
										</div>
										<div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
											{s.l}
										</div>
									</div>
								))}
								<div className="col-span-2 mt-8 flex items-center justify-between border-border border-t pt-8">
									<div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
										Full case study →
									</div>
									<div className="h-8 w-8 rounded-full bg-border" />
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			<CTA />
			<Footer />
		</div>
	);
}
