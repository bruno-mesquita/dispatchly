"use client";

import { Badge } from "@dispatchly/ui/components/badge";
import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { Input } from "@dispatchly/ui/components/input";
import { Label } from "@dispatchly/ui/components/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Kicker } from "@/components/kicker";
import type { JourneyStatus } from "@/hooks/use-journeys";
import { useJourneys } from "@/hooks/use-journeys";

const STATUS_VARIANT: Record<
	JourneyStatus,
	"default" | "secondary" | "outline" | "destructive"
> = {
	active: "default",
	draft: "outline",
	paused: "secondary",
	archived: "destructive",
};

export default function JourneysPage() {
	const router = useRouter();
	const { journeys, create, remove } = useJourneys();
	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}
		const journey = create({
			name: name.trim(),
			description: description.trim() || undefined,
		});
		toast.success("Journey created");
		setShowForm(false);
		setName("");
		setDescription("");
		router.push(`/dashboard/journeys/${journey.id}`);
	}

	function handleDelete(id: string) {
		remove(id);
		toast.success("Journey removed");
	}

	return (
		<div className="space-y-8 p-6 lg:p-10">
			<div className="flex items-center justify-between">
				<header>
					<Kicker num="03" label="Journeys" />
					<h1 className="font-medium font-sans text-3xl tracking-tight">
						Visual Flows —{" "}
						<span className="text-muted-foreground">orchestrate channels.</span>
					</h1>
				</header>
				{!showForm && (
					<Button
						onClick={() => setShowForm(true)}
						className="font-mono text-[11px] uppercase tracking-wider"
					>
						+ New Journey
					</Button>
				)}
			</div>

			{showForm && (
				<Card className="max-w-lg border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							Create New Journey
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={handleCreate} className="space-y-5">
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Journey Name
								</Label>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Ex: Onboarding Welcome"
									className="bg-background font-mono text-[12px]"
									autoFocus
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Description (optional)
								</Label>
								<Input
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="What does this journey do?"
									className="bg-background font-mono text-[12px]"
								/>
							</div>
							<div className="flex gap-3">
								<Button
									type="submit"
									className="flex-1 font-mono text-[12px] uppercase tracking-wider"
								>
									Create & Open Editor
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowForm(false);
										setName("");
										setDescription("");
									}}
									className="px-6 font-mono text-[12px] uppercase tracking-wider"
								>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{journeys.map((journey) => (
					<Card
						key={journey.id}
						className="group border-hairline bg-muted/5 shadow-none"
					>
						<CardHeader className="pb-2">
							<div className="flex items-start justify-between gap-2">
								<CardTitle className="font-medium font-sans text-[15px] tracking-tight transition-colors group-hover:text-primary">
									{journey.name}
								</CardTitle>
								<Badge
									variant={STATUS_VARIANT[journey.status]}
									className="h-4 shrink-0 px-1.5 font-mono text-[9px] opacity-70"
								>
									{journey.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{journey.description && (
								<p className="line-clamp-2 font-mono text-[12px] text-muted-foreground opacity-70">
									{journey.description}
								</p>
							)}
							<div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground opacity-50">
								<span>{journey.nodes.length} steps</span>
								<span>·</span>
								<span>
									{new Date(journey.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>
							<div className="flex gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										router.push(`/dashboard/journeys/${journey.id}`)
									}
									className="flex-1 font-mono text-[10px] uppercase opacity-70 hover:opacity-100"
								>
									Open Editor
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDelete(journey.id)}
									className="font-mono text-[10px] uppercase opacity-70 hover:opacity-100"
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
				{journeys.length === 0 && (
					<div className="col-span-full rounded-lg border-2 border-hairline border-dashed py-20 text-center opacity-30">
						<p className="font-mono text-[12px] uppercase">
							No journeys deployed yet.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
