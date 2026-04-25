import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PulseDot } from "@/components/pulse-dot";
import { authClient } from "@/lib/auth-client";
import { AdminNav } from "./admin-nav";

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
		<div className="flex h-full flex-col overflow-hidden bg-background text-foreground">
			{/* Console Toolbar */}
			<header className="flex h-10 shrink-0 items-center justify-between border-b bg-secondary/30 px-4 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
				<div className="flex items-center gap-4">
					<div className="flex gap-1.5">
						<div className="h-2 w-2 rounded-full bg-border" />
						<div className="h-2 w-2 rounded-full bg-border" />
						<div className="h-2 w-2 rounded-full bg-border" />
					</div>
					<span>app.dispatchly.com / admin</span>
				</div>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<PulseDot size={5} />
						<span className="text-foreground">live · production</span>
					</div>
					<div className="flex items-center gap-2 border-border border-l pl-6">
						<span>{session.user.email}</span>
						<span className="font-bold text-accent">[ADMIN]</span>
					</div>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="flex w-52 shrink-0 flex-col border-r bg-background font-mono text-[12.5px]">
					<div className="flex-1 overflow-y-auto p-4">
						<p className="mb-4 px-2.5 font-bold text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
							[Console Menu]
						</p>
						<AdminNav />
					</div>
					<div className="border-t bg-secondary/10 p-4 text-[10.5px] text-muted-foreground">
						<div className="flex justify-between uppercase tracking-tight">
							<span>Instance</span>
							<span className="text-foreground">DX-PROD-01</span>
						</div>
						<div className="mt-1 flex justify-between uppercase tracking-tight">
							<span>Region</span>
							<span className="text-foreground">us-east-1</span>
						</div>
					</div>
				</aside>

				{/* Main Content Area */}
				<div className="flex flex-1 flex-row overflow-hidden">
					<main className="flex-1 overflow-auto bg-background p-6">
						{children}
					</main>

					{/* Optional Right Rail for Logs/Details (can be implemented per page or here if generic) */}
					{/* For now, we leave it as a slot that pages can use if they want a 3-column look */}
				</div>
			</div>
		</div>
	);
}
