import {
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
		<div className="bg-background font-sans text-foreground antialiased">
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
