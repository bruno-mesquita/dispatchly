"use client";

import {
	Nav,
	Footer,
	Pricing as PricingHero,
	CTA,
	Kicker,
} from "@/components/landing";

const COMPARISON = [
	{ feat: "Monthly dispatches", free: "10,000", scale: "Unlimited", ent: "Unlimited" },
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
	{ q: "What counts as a dispatch?", a: "A single message sent to a single recipient over one channel (email, SMS, or push). If you send an email and a push to the same user, that's two dispatches." },
	{ q: "Can I move between plans?", a: "Yes, you can upgrade or downgrade at any time. If you downgrade, your new limits apply at the end of the current billing cycle." },
	{ q: "Do you offer startup discounts?", a: "Yes, eligible startups get 1 year of Scale for free. Contact our sales team for more info." },
];

export default function PricingPage() {
	return (
		<div className="bg-background font-sans text-foreground antialiased">
			<Nav />
			<div className="pt-20">
				<PricingHero />
			</div>

			{/* Comparison Table */}
			<section className="py-20 px-10 border-b border-border bg-background">
				<div className="max-w-[1200px] mx-auto">
					<Kicker num="05" label="Comparison" />
					<h2 className="text-4xl font-normal tracking-tight mb-10 text-foreground">
						Detailed <span className="italic font-serif">breakdown.</span>
					</h2>
					
					<div className="border border-border rounded-lg overflow-hidden">
						<div className="grid grid-cols-4 bg-secondary border-b border-border font-mono text-[11px] uppercase tracking-wider text-muted-foreground p-4">
							<div>Feature</div>
							<div className="text-center">Free</div>
							<div className="text-center text-foreground font-bold">Scale</div>
							<div className="text-center">Enterprise</div>
						</div>
						{COMPARISON.map((row, i) => (
							<div key={row.feat} className={`grid grid-cols-4 p-4 text-[13px] items-center ${i < COMPARISON.length - 1 ? 'border-b border-border' : ''}`}>
								<div className="font-medium">{row.feat}</div>
								<div className="text-center text-muted-foreground">{row.free}</div>
								<div className="text-center font-semibold">{row.scale}</div>
								<div className="text-center text-muted-foreground">{row.ent}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-20 px-10 border-b border-border bg-secondary">
				<div className="max-w-[800px] mx-auto">
					<Kicker num="06" label="Questions" />
					<h2 className="text-4xl font-normal tracking-tight mb-12 text-foreground">
						Common <span className="italic font-serif">inquiries.</span>
					</h2>
					<div className="space-y-12">
						{FAQ.map(item => (
							<div key={item.q}>
								<h3 className="text-lg font-medium mb-3 text-foreground tracking-tight">{item.q}</h3>
								<p className="text-[15px] leading-relaxed text-muted-foreground max-w-[640px]">
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
