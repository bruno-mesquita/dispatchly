"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { PulseDot } from "./pulse-dot";
import { useState } from "react";

export default function Header() {
	const [region, setRegion] = useState("global");
	const regions = ["global", "americas", "europe", "apac"];

	return (
		<header className="border-b bg-muted/10">
			<div className="flex flex-row items-center justify-between px-4 py-2">
				<div className="flex items-center gap-4 font-mono text-[12px]">
					<div className="flex gap-1.5 mr-2">
						<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
						<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
						<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
					</div>
					<div className="text-muted-foreground opacity-60">
						app.dispatchly.com / live
					</div>
				</div>

				<div className="flex items-center gap-6">
					<div className="flex items-center gap-1 rounded-md border bg-background p-0.5">
						{regions.map((r) => (
							<button
								key={r}
								type="button"
								onClick={() => setRegion(r)}
								className={`rounded-[3px] px-2 py-0.5 font-mono text-[10px] tracking-tight uppercase transition-colors ${
									region === r
										? "bg-foreground text-background"
										: "text-muted-foreground hover:bg-muted"
								}`}
							>
								{r}
							</button>
						))}
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
							<PulseDot size={5} />
							<span>live</span>
						</div>
						<div className="h-4 w-px bg-border" />
						<div className="flex items-center gap-2">
							<ModeToggle />
							<UserMenu />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
