"use client";

import {
	Nav,
	Footer,
	CTA,
	Kicker,
	LogoBar,
} from "@/components/landing";

const CASE_STUDIES = [
	{
		company: "Linear",
		metric: "99.9% uptime",
		quote: "We needed a messaging layer that could keep up with our pace. Dispatchly's reliability is unmatched.",
		author: "Engineering Team",
		stats: [
			{ l: "Dispatches/mo", v: "15M+" },
			{ l: "Avg Latency", v: "42ms" },
		],
	},
	{
		company: "Vercel",
		metric: "Global Scale",
		quote: "Orchestrating notifications across the globe was a nightmare before Dispatchly. Now it's a single API call.",
		author: "Platform Team",
		stats: [
			{ l: "Regions", v: "14" },
			{ l: "Setup time", v: "4 mins" },
		],
	},
	{
		company: "Attio",
		metric: "CRM Sync",
		quote: "The ability to branch journeys based on CRM traits directly in Dispatchly saved us months of custom code.",
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
			
			<section className="pt-40 pb-20 px-10 border-b border-border bg-background relative overflow-hidden">
				<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-30" />
				<div className="max-w-[1200px] mx-auto relative text-center">
					<Kicker num="01" label="Customers" />
					<h1 className="text-7xl font-medium tracking-tight leading-[0.98] mb-8 mx-auto max-w-[800px] text-foreground">
						Trusted by the <span className="italic font-serif font-normal">best teams.</span>
					</h1>
					<p className="text-lg text-muted-foreground mx-auto max-w-[520px] leading-relaxed">
						From solo founders to global platforms, Dispatchly powers the notifications that keep users engaged.
					</p>
				</div>
			</section>

			<LogoBar />

			<section className="py-20 px-10 border-b border-border bg-background">
				<div className="max-w-[1200px] mx-auto space-y-32">
					{CASE_STUDIES.map((cs, i) => (
						<div key={cs.company} className={`grid grid-cols-[1.2fr_1fr] gap-20 items-center ${i % 2 === 1 ? 'direction-rtl' : ''}`}>
							<div className={i % 2 === 1 ? 'order-2' : ''}>
								<div className="font-mono text-[11px] uppercase tracking-wider text-accent mb-4">{cs.metric}</div>
								<h2 className="text-4xl font-medium tracking-tight mb-8 text-foreground">{cs.company}</h2>
								<blockquote className="text-3xl font-normal font-serif italic leading-snug text-foreground mb-8">
									&ldquo;{cs.quote}&rdquo;
								</blockquote>
								<div className="text-sm text-muted-foreground font-mono">{cs.author}</div>
							</div>

							<div className={`p-10 border border-border rounded-lg bg-secondary grid grid-cols-2 gap-8 ${i % 2 === 1 ? 'order-1' : ''}`}>
								{cs.stats.map(s => (
									<div key={s.l}>
										<div className="text-4xl font-medium tracking-tight text-foreground mb-2">{s.v}</div>
										<div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{s.l}</div>
									</div>
								))}
								<div className="col-span-2 pt-8 mt-8 border-t border-border flex justify-between items-center">
									<div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Full case study →</div>
									<div className="w-8 h-8 rounded-full bg-border" />
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
