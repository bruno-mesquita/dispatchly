"use client";

import { CTA, Footer, Kicker, Nav } from "@/components/landing";

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

			<section className="relative overflow-hidden border-border border-b bg-background px-10 pt-40 pb-20">
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
				<div className="relative mx-auto max-w-[1200px]">
					<Kicker num="01" label="Changelog" />
					<h1 className="mb-8 max-w-[700px] font-medium text-7xl text-foreground leading-[0.98] tracking-tight">
						New{" "}
						<span className="font-normal font-serif italic">dispatches.</span>
					</h1>
					<p className="max-w-[480px] text-lg text-muted-foreground leading-relaxed">
						What we&apos;ve been shipping. Features, fixes, and architectural
						improvements to the messaging layer.
					</p>
				</div>
			</section>

			<section className="border-border border-b bg-background px-10 py-20">
				<div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_2.5fr] gap-20">
					<aside className="sticky top-32 h-fit">
						<div className="mb-4 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Subscribe
						</div>
						<div className="flex flex-col gap-4">
							<a
								href="#"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								RSS Feed
							</a>
							<a
								href="#"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								Twitter / X
							</a>
							<a
								href="#"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								Newsletter
							</a>
						</div>
					</aside>

					<div className="relative space-y-32 border-border border-l py-10 pl-20">
						{LOGS.map((log) => (
							<div key={log.date} className="relative">
								{/* Timeline Dot */}
								<div className="absolute top-1.5 -left-[85px] h-3 w-3 rounded-full border-2 border-accent bg-background" />

								<div className="mb-4 font-mono text-[13px] text-accent tracking-tight">
									[{log.date}]
								</div>
								<h2 className="mb-6 font-medium text-3xl text-foreground tracking-tight">
									{log.title}
								</h2>
								<div className="mb-8 flex gap-2">
									{log.tags.map((tag) => (
										<span
											key={tag}
											className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wider"
										>
											{tag}
										</span>
									))}
								</div>
								<p className="max-w-[640px] text-[17px] text-muted-foreground leading-relaxed">
									{log.desc}
								</p>

								{/* Placeholder for an image or code block in a real changelog */}
								<div className="mt-12 grid h-80 place-items-center rounded-lg border border-border bg-secondary">
									<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider opacity-30">
										Visual context
									</span>
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
