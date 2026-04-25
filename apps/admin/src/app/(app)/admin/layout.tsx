import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

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

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await authClient.getSession({
		fetchOptions: { headers: await headers(), throw: true },
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen">
			<aside className="flex w-56 shrink-0 flex-col gap-1 border-r bg-muted/40 p-4">
				<p className="mb-4 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
					Admin
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
			<main className="flex-1 overflow-auto p-8">{children}</main>
		</div>
	);
}
