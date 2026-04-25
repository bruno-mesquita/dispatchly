"use client";

import { Footer, Kicker, Nav } from "@/components/landing";

export default function AboutPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
			<Nav />

			<main className="relative flex-1 overflow-hidden bg-background px-10 pt-40 pb-20">
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />

				<div className="relative mx-auto max-w-[800px]">
					<Kicker num="01" label="Maker" />

					<div className="mb-16 flex flex-col items-start gap-12 md:flex-row md:items-center">
						<img
							src="https://github.com/bruno-mesquita.png"
							alt="Bruno Mesquita"
							className="h-32 w-32 rounded-lg border border-border grayscale transition-all duration-500 hover:grayscale-0"
						/>
						<div>
							<h1 className="mb-4 font-medium text-6xl text-foreground leading-[0.98] tracking-tight">
								Bruno{" "}
								<span className="font-normal font-serif text-muted-foreground italic">
									Mesquita
								</span>
							</h1>
							<div className="font-mono text-[13px] text-accent tracking-tight">
								<a
									href="https://github.com/bruno-mesquita"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
								>
									github.com/bruno-mesquita
								</a>
							</div>
						</div>
					</div>

					<div className="max-w-[640px] space-y-8 text-lg text-muted-foreground leading-relaxed">
						<p>
							Dispatchly is the result of years of frustration with fragmented
							notification infrastructure. I wanted a single, reliable layer for
							email, SMS, and push that felt like real infrastructure, not just
							another wrapper.
						</p>
						<p>
							Everything here is built for scale, but more importantly, for
							developer sanity. From the raw logs to the journey orchestration,
							every feature is something I needed in my own projects.
						</p>
						<p>
							If you&apos;re building something that needs to talk to users, I
							hope Dispatchly makes your life a bit easier.
						</p>
					</div>

					<div className="mt-20 flex flex-col gap-6 border-border border-t pt-12">
						<div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Connect
						</div>
						<div className="flex gap-8">
							<a
								href="https://github.com/bruno-mesquita"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								GitHub
							</a>
							<a
								href="https://twitter.com/bruno_mesquita"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								Twitter
							</a>
							<a
								href="mailto:bruno@dispatchly.io"
								className="font-medium text-sm transition-colors hover:text-accent"
							>
								Email
							</a>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
