"use client";

import {
	Nav,
	Footer,
	Kicker,
} from "@/components/landing";

export default function AboutPage() {
	return (
		<div className="bg-background font-sans text-foreground antialiased min-h-screen flex flex-col">
			<Nav />
			
			<main className="flex-1 pt-40 pb-20 px-10 bg-background relative overflow-hidden">
				<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-30" />
				
				<div className="max-w-[800px] mx-auto relative">
					<Kicker num="01" label="Maker" />
					
					<div className="flex flex-col md:flex-row gap-12 items-start md:items-center mb-16">
						<img 
							src="https://github.com/bruno-mesquita.png" 
							alt="Bruno Mesquita" 
							className="w-32 h-32 rounded-lg border border-border grayscale hover:grayscale-0 transition-all duration-500"
						/>
						<div>
							<h1 className="text-6xl font-medium tracking-tight leading-[0.98] mb-4 text-foreground">
								Bruno <span className="italic font-serif font-normal text-muted-foreground">Mesquita</span>
							</h1>
							<div className="font-mono text-[13px] text-accent tracking-tight">
								<a href="https://github.com/bruno-mesquita" target="_blank" rel="noopener noreferrer" className="hover:underline">
									github.com/bruno-mesquita
								</a>
							</div>
						</div>
					</div>

					<div className="space-y-8 text-lg leading-relaxed text-muted-foreground max-w-[640px]">
						<p>
							Dispatchly is the result of years of frustration with fragmented notification infrastructure. 
							I wanted a single, reliable layer for email, SMS, and push that felt like real infrastructure, not just another wrapper.
						</p>
						<p>
							Everything here is built for scale, but more importantly, for developer sanity. 
							From the raw logs to the journey orchestration, every feature is something I needed in my own projects.
						</p>
						<p>
							If you&apos;re building something that needs to talk to users, I hope Dispatchly makes your life a bit easier.
						</p>
					</div>

					<div className="mt-20 pt-12 border-t border-border flex flex-col gap-6">
						<div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Connect</div>
						<div className="flex gap-8">
							<a href="https://github.com/bruno-mesquita" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-accent transition-colors">GitHub</a>
							<a href="https://twitter.com/bruno_mesquita" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-accent transition-colors">Twitter</a>
							<a href="mailto:bruno@dispatchly.io" className="text-sm font-medium hover:text-accent transition-colors">Email</a>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
