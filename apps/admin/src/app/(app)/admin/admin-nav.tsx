"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@dispatchly/ui/lib/utils";

const NAV = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/organizations", label: "Organizations" },
	{ href: "/admin/users", label: "Users" },
	{ href: "/admin/subscriptions", label: "Subscriptions" },
	{ href: "/admin/logs", label: "Logs" },
	{ href: "/admin/templates", label: "Templates" },
	{ href: "/admin/webhooks", label: "Webhooks" },
	{ href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-0.5">
			{NAV.map((n) => {
				const isActive = pathname === n.href;
				return (
					<Link
						key={n.href}
						href={n.href as any}
						className={cn(
							"flex justify-between items-center rounded px-2.5 py-1.5 transition-colors",
							isActive
								? "bg-accent-tint text-accent font-semibold"
								: "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
						)}
					>
						<span>{n.label}</span>
						{isActive && <span className="text-[10px]">▸</span>}
					</Link>
				);
			})}
		</nav>
	);
}
