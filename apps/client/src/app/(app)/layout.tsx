import Link from "next/link";
import Header from "@/components/header";

const NAV = [
	{ href: "/dashboard", label: "Visão Geral" },
	{ href: "/dashboard/send", label: "Enviar" },
	{ href: "/dashboard/batch", label: "Lote" },
	{ href: "/dashboard/templates", label: "Templates" },
	{ href: "/dashboard/logs", label: "Logs" },
	{ href: "/dashboard/webhooks", label: "Webhooks" },
	{ href: "/dashboard/billing", label: "Plano" },
	{ href: "/dashboard/settings", label: "Configurações" },
];

export default function AppLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="grid h-svh grid-rows-[auto_1fr] overflow-hidden">
			<Header />
			<div className="flex overflow-hidden">
				<aside className="flex w-52 shrink-0 flex-col gap-1 border-r bg-muted/40 p-4">
					<p className="mb-4 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
						Dashboard
					</p>
					{NAV.map((n) => (
						<Link
							key={n.href}
							href={n.href as any}
							className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							{n.label}
						</Link>
					))}
				</aside>
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
