"use client";

import {
	Nav,
	Footer,
	CTA,
	Kicker,
} from "@/components/landing";

const LOGS = [
	{
		date: "2026-04-12",
		title: "Scheduled Journeys",
		desc: "You can now schedule journeys to start at any point in the future. Perfect for drip campaigns and re-engagement flows.",
		tags: ["Feature", "Journeys"],
	},
	{
		date: "2026-03-28",
		title: "Python SDK v2.0",
		desc: "A complete rewrite of our Python SDK with full type hinting and async support. Now available on PyPI.",
		tags: ["DevTools", "SDK"],
	},
	{
		date: "2026-03-15",
		title: "Custom Domain Warming",
		desc: "New automated warming sequences for dedicated IPs and custom domains. Reach high volumes faster while keeping reputation high.",
		tags: ["Deliverability"],
	},
	{
		date: "2026-02-20",
		title: "Vercel Integration",
		desc: "Connect your Vercel projects directly to Dispatchly. Sync environment variables and trigger deploys from journey events.",
		tags: ["Integration"],
	},
];

export default function ChangelogPage() {
	return (
		<div className="bg-background font-sans text-foreground antialiased">
			<Nav />
			
			<section className="pt-40 pb-20 px-10 border-b border-border bg-background relative overflow-hidden">
				<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-30" />
				<div className="max-w-[1200px] mx-auto relative">
					<Kicker num="01" label="Changelog" />
					<h1 className="text-7xl font-medium tracking-tight leading-[0.98] mb-8 max-w-[700px] text-foreground">
						New <span className="italic font-serif font-normal">dispatches.</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-[480px] leading-relaxed">
						What we&apos;ve been shipping. Features, fixes, and architectural improvements to the messaging layer.
					</p>
				</div>
			</section>

			<section className="py-20 px-10 border-b border-border bg-background">
				<div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_2.5fr] gap-20">
					<aside className="sticky top-32 h-fit">
						<div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">Subscribe</div>
						<div className="flex flex-col gap-4">
							<a href="#" className="text-sm font-medium hover:text-accent transition-colors">RSS Feed</a>
							<a href="#" className="text-sm font-medium hover:text-accent transition-colors">Twitter / X</a>
							<a href="#" className="text-sm font-medium hover:text-accent transition-colors">Newsletter</a>
						</div>
					</aside>

					<div className="relative border-l border-border pl-20 space-y-32 py-10">
						{LOGS.map(log => (
							<div key={log.date} className="relative">
								{/* Timeline Dot */}
								<div className="absolute -left-[85px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-accent" />
								
								<div className="font-mono text-[13px] text-accent mb-4 tracking-tight">[{log.date}]</div>
								<h2 className="text-3xl font-medium tracking-tight mb-6 text-foreground">{log.title}</h2>
								<div className="flex gap-2 mb-8">
									{log.tags.map(tag => (
										<span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-border rounded text-muted-foreground bg-secondary">
											{tag}
										</span>
									))}
								</div>
								<p className="text-[17px] leading-relaxed text-muted-foreground max-w-[640px]">
									{log.desc}
								</p>
								
								{/* Placeholder for an image or code block in a real changelog */}
								<div className="mt-12 h-80 bg-secondary border border-border rounded-lg grid place-items-center">
									<span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground opacity-30">Visual context</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<CTA />
			<Footer />
		</div>
	);
}
