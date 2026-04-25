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
		<div className="p-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-semibold text-2xl">Templates</h1>
				<Button onClick={openCreate}>+ Novo Template</Button>
			</div>

			{showForm && (
				<Card className="mb-6 max-w-xl">
					<CardHeader>
						<CardTitle className="text-base">
							{editingId ? "Editar Template" : "Novo Template"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label>Nome</Label>
									<Input
										value={form.name}
										onChange={(e) =>
											setForm((f) => ({ ...f, name: e.target.value }))
										}
										placeholder="Ex: Boas-vindas"
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Tipo</Label>
									<Select
										value={form.type}
										onValueChange={(v) =>
											setForm((f) => ({ ...f, type: v as LogType }))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="sms">SMS</SelectItem>
											<SelectItem value="push">Push</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{form.type === "email" && (
								<div className="space-y-1.5">
									<Label>Assunto</Label>
									<Input
										value={form.subject}
										onChange={(e) =>
											setForm((f) => ({ ...f, subject: e.target.value }))
										}
										placeholder="Assunto do email"
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<Label>Conteúdo</Label>
								<textarea
									className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									value={form.content}
									onChange={(e) =>
										setForm((f) => ({ ...f, content: e.target.value }))
									}
									placeholder="Use {{variavel}} para interpolação"
								/>
							</div>

							<div className="space-y-1.5">
								<Label>Variáveis (separadas por vírgula)</Label>
								<Input
									value={form.variables}
									onChange={(e) =>
										setForm((f) => ({ ...f, variables: e.target.value }))
									}
									placeholder="nome, email, link"
								/>
							</div>

							<div className="flex gap-2">
								<Button type="submit" className="flex-1">
									{editingId ? "Salvar" : "Criar"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowForm(false);
										setEditingId(null);
									}}
								>
									Cancelar
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{templates.map((tpl) => (
					<Card key={tpl.id}>
						<CardHeader className="pb-2">
							<div className="flex items-start justify-between">
								<CardTitle className="text-base">{tpl.name}</CardTitle>
								<Badge variant={TYPE_VARIANT[tpl.type] ?? "secondary"}>
									{tpl.type}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							{tpl.subject && (
								<p className="text-muted-foreground text-sm">
									<span className="font-medium">Assunto:</span> {tpl.subject}
								</p>
							)}
							<p className="line-clamp-2 text-sm">{tpl.content}</p>
							{tpl.variables.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{tpl.variables.map((v) => (
										<Badge key={v} variant="outline" className="text-xs">
											{`{{${v}}}`}
										</Badge>
									))}
								</div>
							)}
							<div className="flex gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => openEdit(tpl)}
									className="flex-1"
								>
									Editar
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDelete(tpl.id)}
								>
									Excluir
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
				{templates.length === 0 && (
					<p className="col-span-3 text-center text-muted-foreground">
						Nenhum template criado ainda.
					</p>
				)}
			</div>
		</div>
	);
}
