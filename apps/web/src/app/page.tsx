"use client";

import {
	CSS_VARS,
	CTA,
	FeatureStrip,
	Footer,
	Hero,
	JourneysFeature,
	LogoBar,
	Nav,
	Pricing,
	StatsRow,
	Testimonial,
} from "@/components/landing";

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
