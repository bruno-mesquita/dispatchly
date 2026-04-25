"use client";

import {
	CTA,
	Footer,
	Kicker,
	Nav,
	Pricing as PricingHero,
} from "@/components/landing";

const COMPARISON = [
	{
		feat: "Monthly dispatches",
		free: "10,000",
		scale: "Unlimited",
		ent: "Unlimited",
	},
	{ feat: "Channels", free: "All 3", scale: "All 3", ent: "All 3" },
	{ feat: "Journeys", free: "1", scale: "Unlimited", ent: "Unlimited" },
	{ feat: "Team members", free: "2", scale: "Unlimited", ent: "Unlimited" },
	{ feat: "A/B Testing", free: "—", scale: "Yes", ent: "Yes" },
	{ feat: "Priority Routing", free: "—", scale: "Yes", ent: "Yes" },
	{ feat: "SSO (SAML/OIDC)", free: "—", scale: "Yes", ent: "Yes" },
	{ feat: "Dedicated IPs", free: "—", scale: "Optional", ent: "Included" },
	{ feat: "Custom SLA", free: "—", scale: "—", ent: "99.999%" },
	{ feat: "Support", free: "Community", scale: "Priority", ent: "Dedicated" },
];

const FAQ = [
	{
		q: "What counts as a dispatch?",
		a: "A single message sent to a single recipient over one channel (email, SMS, or push). If you send an email and a push to the same user, that's two dispatches.",
	},
	{
		q: "Can I move between plans?",
		a: "Yes, you can upgrade or downgrade at any time. If you downgrade, your new limits apply at the end of the current billing cycle.",
	},
	{
		q: "Do you offer startup discounts?",
		a: "Yes, eligible startups get 1 year of Scale for free. Contact our sales team for more info.",
	},
];

export default function PricingPage() {
	return (
		<div className="bg-background font-sans text-foreground antialiased">
			<Nav />
			<div className="pt-20">
				<PricingHero />
			</div>

			{/* Comparison Table */}
			<section className="border-border border-b bg-background px-10 py-20">
				<div className="mx-auto max-w-[1200px]">
					<Kicker num="05" label="Comparison" />
					<h2 className="mb-10 font-normal text-4xl text-foreground tracking-tight">
						Detailed <span className="font-serif italic">breakdown.</span>
					</h2>

					<div className="overflow-hidden rounded-lg border border-border">
						<div className="grid grid-cols-4 border-border border-b bg-secondary p-4 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							<div>Feature</div>
							<div className="text-center">Free</div>
							<div className="text-center font-bold text-foreground">Scale</div>
							<div className="text-center">Enterprise</div>
						</div>
						{COMPARISON.map((row, i) => (
							<div
								key={row.feat}
								className={`grid grid-cols-4 items-center p-4 text-[13px] ${i < COMPARISON.length - 1 ? "border-border border-b" : ""}`}
							>
								<div className="font-medium">{row.feat}</div>
								<div className="text-center text-muted-foreground">
									{row.free}
								</div>
								<div className="text-center font-semibold">{row.scale}</div>
								<div className="text-center text-muted-foreground">
									{row.ent}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="border-border border-b bg-secondary px-10 py-20">
				<div className="mx-auto max-w-[800px]">
					<Kicker num="06" label="Questions" />
					<h2 className="mb-12 font-normal text-4xl text-foreground tracking-tight">
						Common <span className="font-serif italic">inquiries.</span>
					</h2>
					<div className="space-y-12">
						{FAQ.map((item) => (
							<div key={item.q}>
								<h3 className="mb-3 font-medium text-foreground text-lg tracking-tight">
									{item.q}
								</h3>
								<p className="max-w-[640px] text-[15px] text-muted-foreground leading-relaxed">
									{item.a}
								</p>
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
