import Link from "next/link";
import Header from "@/components/header";
import { PulseDot } from "@/components/pulse-dot";

const NAV = [
	{ href: "/dashboard", label: "Overview", icon: "□" },
	{ href: "/dashboard/send", label: "Dispatches", icon: "→" },
	{ href: "/dashboard/batch", label: "Batch Ops", icon: "▤" },
	{ href: "/dashboard/templates", label: "Templates", icon: "◇" },
	{ href: "/dashboard/logs", label: "Logs", icon: "☰" },
	{ href: "/dashboard/webhooks", label: "Webhooks", icon: "⚓" },
	{ href: "/dashboard/billing", label: "Plan & Billing", icon: "💳" },
	{ href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default function AppLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="grid h-svh grid-rows-[auto_1fr] overflow-hidden bg-background">
			<Header />
			<div className="flex overflow-hidden">
				<aside className="flex w-56 shrink-0 flex-col border-r bg-muted/20">
					<div className="flex flex-1 flex-col gap-1 p-3">
						<p className="mb-4 px-3 font-mono font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.1em] opacity-50">
							[Multi-Channel Ops]
						</p>
						{NAV.map((n) => (
							<Link
								key={n.href}
								href={n.href as any}
								className="flex items-center justify-between rounded-md px-3 py-2 font-mono text-[12.5px] transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								<span>{n.label}</span>
								<span className="opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
									▸
								</span>
							</Link>
						))}
					</div>
					<div className="border-t p-4 font-mono text-[10.5px] text-muted-foreground opacity-60">
						<div>team: dispatchly.io</div>
						<div className="mt-1 flex items-center gap-2">
							env: <span className="font-medium text-primary">production</span>
							<PulseDot size={4} />
						</div>
					</div>
				</aside>
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
