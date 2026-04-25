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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";
import { useState } from "react";
import { toast } from "sonner";
import { Kicker } from "@/components/kicker";

import type { LogType } from "@/hooks/use-notification-logs";
import type { Template } from "@/hooks/use-templates";
import { useTemplates } from "@/hooks/use-templates";

const TYPE_VARIANT: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	email: "default",
	sms: "secondary",
	push: "outline",
};

type FormState = {
	name: string;
	type: LogType;
	subject: string;
	content: string;
	variables: string;
};

const EMPTY_FORM: FormState = {
	name: "",
	type: "email",
	subject: "",
	content: "",
	variables: "",
};

export default function TemplatesPage() {
	const { templates, create, update, remove } = useTemplates();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState<FormState>(EMPTY_FORM);

	function parseVariables(raw: string): string[] {
		return raw
			.split(",")
			.map((v) => v.trim())
			.filter(Boolean);
	}

	function openCreate() {
		setEditingId(null);
		setForm(EMPTY_FORM);
		setShowForm(true);
	}

	function openEdit(tpl: Template) {
		setEditingId(tpl.id);
		setForm({
			name: tpl.name,
			type: tpl.type,
			subject: tpl.subject ?? "",
			content: tpl.content,
			variables: tpl.variables.join(", "),
		});
		setShowForm(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.name || !form.content) {
			toast.error("Nome e conteúdo são obrigatórios");
			return;
		}
		const data = {
			name: form.name,
			type: form.type,
			subject: form.subject || undefined,
			content: form.content,
			variables: parseVariables(form.variables),
			isActive: true,
		};
		if (editingId) {
			update(editingId, data);
			toast.success("Template atualizado!");
		} else {
			create(data);
			toast.success("Template criado!");
		}
		setShowForm(false);
		setForm(EMPTY_FORM);
		setEditingId(null);
	}

	function handleDelete(id: string) {
		remove(id);
		toast.success("Template removido");
	}

	return (
		<div className="space-y-8 p-6 lg:p-10">
			<div className="flex items-center justify-between">
				<header>
					<Kicker num="04" label="Templates" />
					<h1 className="font-medium font-sans text-3xl tracking-tight">
						Message Layouts —{" "}
						<span className="text-muted-foreground">structured content.</span>
					</h1>
				</header>
				{!showForm && (
					<Button
						onClick={openCreate}
						className="font-mono text-[11px] uppercase tracking-wider"
					>
						+ New Template
					</Button>
				)}
			</div>

			{showForm && (
				<Card className="max-w-2xl border-hairline bg-muted/5 shadow-none">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							{editingId ? "Edit Template" : "Create New Template"}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Template Name
									</Label>
									<Input
										value={form.name}
										onChange={(e) =>
											setForm((f) => ({ ...f, name: e.target.value }))
										}
										placeholder="Ex: Welcome Email"
										className="bg-background font-mono text-[12px]"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Channel Type
									</Label>
									<Select
										value={form.type}
										onValueChange={(v) =>
											setForm((f) => ({ ...f, type: v as LogType }))
										}
									>
										<SelectTrigger className="bg-background font-mono text-[12px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="font-mono text-[12px]">
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="sms">SMS</SelectItem>
											<SelectItem value="push">Push</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{form.type === "email" && (
								<div className="space-y-1.5">
									<Label className="font-mono text-[10px] uppercase opacity-60">
										Subject Line
									</Label>
									<Input
										value={form.subject}
										onChange={(e) =>
											setForm((f) => ({ ...f, subject: e.target.value }))
										}
										placeholder="Email subject"
										className="bg-background font-mono text-[12px]"
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Body Content
								</Label>
								<textarea
									className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									value={form.content}
									onChange={(e) =>
										setForm((f) => ({ ...f, content: e.target.value }))
									}
									placeholder="Use {{variable}} for dynamic data"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="font-mono text-[10px] uppercase opacity-60">
									Variables (comma separated)
								</Label>
								<Input
									value={form.variables}
									onChange={(e) =>
										setForm((f) => ({ ...f, variables: e.target.value }))
									}
									placeholder="name, account_id, link"
									className="bg-background font-mono text-[12px]"
								/>
							</div>

							<div className="flex gap-3">
								<Button
									type="submit"
									className="flex-1 font-mono text-[12px] uppercase tracking-wider"
								>
									{editingId ? "Save Changes" : "Create Template"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowForm(false);
										setEditingId(null);
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
				{templates.map((tpl) => (
					<Card
						key={tpl.id}
						className="group border-hairline bg-muted/5 shadow-none"
					>
						<CardHeader className="pb-2">
							<div className="flex items-start justify-between">
								<CardTitle className="font-medium font-sans text-[15px] tracking-tight transition-colors group-hover:text-primary">
									{tpl.name}
								</CardTitle>
								<Badge
									variant={TYPE_VARIANT[tpl.type] ?? "secondary"}
									className="h-4 px-1.5 font-mono text-[9px] opacity-70"
								>
									{tpl.type}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{tpl.subject && (
								<p className="line-clamp-1 font-mono text-[12px] text-muted-foreground opacity-70">
									<span className="mr-1 text-[10px] uppercase opacity-50">
										Sub:
									</span>{" "}
									{tpl.subject}
								</p>
							)}
							<p className="line-clamp-2 h-10 text-[13px] text-muted-foreground opacity-80">
								{tpl.content}
							</p>
							<div className="flex flex-wrap gap-1">
								{tpl.variables.map((v) => (
									<Badge
										key={v}
										variant="outline"
										className="h-4 border-dashed px-1 font-mono text-[9px] opacity-40"
									>
										{`{{${v}}}`}
									</Badge>
								))}
							</div>
							<div className="flex gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => openEdit(tpl)}
									className="flex-1 font-mono text-[10px] uppercase opacity-70 hover:opacity-100"
								>
									Edit
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDelete(tpl.id)}
									className="font-mono text-[10px] uppercase opacity-70 hover:opacity-100"
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
				{templates.length === 0 && (
					<div className="col-span-full rounded-lg border-2 border-hairline border-dashed py-20 text-center opacity-30">
						<p className="font-mono text-[12px] uppercase">
							No templates deployed yet.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
