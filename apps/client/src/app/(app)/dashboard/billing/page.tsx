"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";

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
		<div className="space-y-1">
			<div className="flex justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span>
					{used.toLocaleString()} / {quota.toLocaleString()}
				</span>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary transition-all"
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
		<div className="space-y-8 p-8">
			<h1 className="font-semibold text-2xl">Plano & Faturamento</h1>

			<Card className="max-w-lg">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Plano Atual</CardTitle>
						<Badge variant={PLAN_BADGE[plan.name]}>
							{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<UsageBar
							label="Emails"
							used={plan.usage.emails}
							quota={plan.quota.emails}
						/>
						<UsageBar
							label="SMS"
							used={plan.usage.sms}
							quota={plan.quota.sms}
						/>
						<UsageBar
							label="Push"
							used={plan.usage.push}
							quota={plan.quota.push}
						/>
					</div>
					<p className="text-muted-foreground text-sm">
						Renova em {new Date(plan.renewsAt).toLocaleDateString("pt-BR")}
					</p>
					{plan.stripeCustomerId && (
						<Button variant="outline" onClick={openPortal} className="w-full">
							Gerenciar Assinatura
						</Button>
					)}
				</CardContent>
			</Card>

			<div>
				<h2 className="mb-4 font-semibold text-lg">Planos Disponíveis</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{plans.map((p) => {
						const isCurrent = p.id === plan.name;
						return (
							<Card
								key={p.id}
								className={
									isCurrent ? "border-primary ring-1 ring-primary" : ""
								}
							>
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<CardTitle className="text-base">{p.label}</CardTitle>
										{isCurrent && <Badge>Atual</Badge>}
									</div>
									<p className="font-semibold text-xl">{p.price}</p>
								</CardHeader>
								<CardContent className="space-y-3">
									<ul className="space-y-1">
										{p.features.map((f) => (
											<li key={f} className="flex items-start gap-2 text-sm">
												<span className="mt-0.5 text-green-500">✓</span>
												<span>{f}</span>
											</li>
										))}
									</ul>
									<Button
										className="w-full"
										variant={isCurrent ? "outline" : "default"}
										disabled={isCurrent || p.id === "enterprise"}
										onClick={() => !isCurrent && createCheckout(p.id)}
									>
										{isCurrent
											? "Plano atual"
											: p.id === "enterprise"
												? "Falar com vendas"
												: "Upgrade"}
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
