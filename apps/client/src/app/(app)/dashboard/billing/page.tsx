"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { Kicker } from "@/components/kicker";

import type { PlanName } from "@/hooks/use-billing";
import { useBilling } from "@/hooks/use-billing";

function UsageBar({
	label,
	used,
	quota,
}: {
	label: string;
	used: number;
	quota: number;
}) {
	const pct = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
	return (
		<div className="space-y-2">
			<div className="flex justify-between font-mono text-[10px] uppercase opacity-60">
				<span>{label}</span>
				<span>
					{used.toLocaleString()} / {quota.toLocaleString()}
				</span>
			</div>
			<div className="h-1 w-full bg-muted rounded-full overflow-hidden">
				<div
					className="h-full bg-primary transition-all duration-500"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

const PLAN_BADGE: Record<PlanName, "default" | "secondary" | "outline"> = {
	free: "secondary",
	basic: "outline",
	pro: "default",
	enterprise: "default",
};

export default function BillingPage() {
	const { plan, plans, createCheckout, openPortal } = useBilling();

	return (
		<div className="p-6 lg:p-10 space-y-12">
			<header>
				<Kicker num="07" label="Billing & Plan" />
				<h1 className="font-sans text-3xl font-medium tracking-tight">
					Subscription — <span className="text-muted-foreground">manage resources.</span>
				</h1>
			</header>

			<div className="grid gap-8 lg:grid-cols-3">
				<Card className="lg:col-span-1 border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<div className="flex items-center justify-between">
							<CardTitle className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground">
								Current Plan
							</CardTitle>
							<Badge variant={PLAN_BADGE[plan.name]} className="h-5 px-2 font-mono text-[10px] uppercase">
								{plan.name}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="p-6 space-y-8">
						<div className="space-y-6">
							<UsageBar
								label="Email Credits"
								used={plan.usage.emails}
								quota={plan.quota.emails}
							/>
							<UsageBar
								label="SMS Credits"
								used={plan.usage.sms}
								quota={plan.quota.sms}
							/>
							<UsageBar
								label="Push Credits"
								used={plan.usage.push}
								quota={plan.quota.push}
							/>
						</div>
						<div className="pt-4 border-t border-hairline space-y-4">
							<p className="font-mono text-[11px] text-muted-foreground opacity-60">
								Next renewal: {new Date(plan.renewsAt).toLocaleDateString("pt-BR")}
							</p>
							{plan.stripeCustomerId && (
								<Button variant="outline" onClick={openPortal} className="w-full font-mono text-[11px] uppercase tracking-wider">
									Manage in Stripe →
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="lg:col-span-2 space-y-6">
					<Kicker num="UPG" label="Available Tiers" />
					<div className="grid gap-4 md:grid-cols-2">
						{plans.map((p) => {
							const isCurrent = p.id === plan.name;
							return (
								<Card
									key={p.id}
									className={`border-hairline shadow-none transition-all ${
										isCurrent ? "bg-primary/[0.03] ring-1 ring-primary/20" : "bg-muted/5 hover:bg-muted/10"
									}`}
								>
									<CardHeader className="pb-2 px-6 pt-6">
										<div className="flex items-center justify-between mb-1">
											<CardTitle className="font-sans text-lg font-medium">{p.label}</CardTitle>
											{isCurrent && <Badge className="h-4 font-mono text-[8px] uppercase">Current</Badge>}
										</div>
										<p className="font-sans text-2xl font-semibold tracking-tight">{p.price}</p>
									</CardHeader>
									<CardContent className="px-6 pb-6 space-y-6">
										<ul className="space-y-2">
											{p.features.map((f) => (
												<li key={f} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
													<span className="text-primary font-mono text-[10px] mt-0.5 opacity-60">✓</span>
													<span className="opacity-80">{f}</span>
												</li>
											))}
										</ul>
										<Button
											className={`w-full font-mono text-[11px] uppercase tracking-wider ${isCurrent ? "opacity-40" : ""}`}
											variant={isCurrent ? "outline" : "default"}
											disabled={isCurrent || p.id === "enterprise"}
											onClick={() => !isCurrent && createCheckout(p.id)}
										>
											{isCurrent
												? "Active Plan"
												: p.id === "enterprise"
													? "Contact Sales"
													: "Upgrade Tier →"}
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
