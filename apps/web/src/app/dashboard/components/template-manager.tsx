"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { Button } from "@dispatchly/ui/components/button";
import { Input } from "@dispatchly/ui/components/input";
import { Label } from "@dispatchly/ui/components/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@dispatchly/ui/components/select";

export function TemplateManager() {
	const [name, setName] = useState("");
	const [type, setType] = useState<"email" | "sms" | "push">("email");
	const [subject, setSubject] = useState("");
	const [content, setContent] = useState("");
	const [isEditing, setIsEditing] = useState<string | null>(null);

	const templates = useQuery(trpc.templates.list.queryOptions({}) as any);

	const createMutation = useMutation({
		mutationFn: async (input: any) =>
			(trpc.templates.create as any).mutate(input),
	});
	const updateMutation = useMutation({
		mutationFn: async (input: any) =>
			(trpc.templates.update as any).mutate(input),
	});
	const deleteMutation = useMutation({
		mutationFn: async (input: any) =>
			(trpc.templates.delete as any).mutate(input),
	});

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createMutation.mutateAsync({
				name,
				type,
				subject: type === "email" ? subject : undefined,
				content,
			});
			toast.success("Template criado!");
			setName("");
			setSubject("");
			setContent("");
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isEditing) return;
		try {
			await updateMutation.mutateAsync({
				id: isEditing,
				name,
				subject,
				content,
			});
			toast.success("Template atualizado!");
			setIsEditing(null);
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Deseja deletar este template?")) {
			try {
				await deleteMutation.mutateAsync({ id });
				toast.success("Template deletado!");
			} catch (error: any) {
				toast.error(error.message);
			}
		}
	};

	const startEdit = (template: any) => {
		setIsEditing(template._id.toString());
		setName(template.name);
		setType(template.type);
		setSubject(template.subject || "");
		setContent(template.content);
	};

	const cancelEdit = () => {
		setIsEditing(null);
		setName("");
		setSubject("");
		setContent("");
		setType("email");
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>
						{isEditing ? "Editar Template" : "Criar Template"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={isEditing ? handleUpdate : handleCreate}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label>Nome</Label>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Nome do template"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label>Tipo</Label>
							<Select
								value={type}
								onValueChange={(v: string | null) =>
									v && setType(v as typeof type)
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
						{type === "email" && (
							<div className="space-y-2">
								<Label>Assunto</Label>
								<Input
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="Assunto do email"
								/>
							</div>
						)}
						<div className="space-y-2">
							<Label>Conteúdo</Label>
							<textarea
								className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Use {{variavel}} para dynamic variables"
								required
							/>
						</div>
						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={createMutation.isPending || updateMutation.isPending}
							>
								{isEditing ? "Atualizar" : "Criar"}
							</Button>
							{isEditing && (
								<Button type="button" variant="outline" onClick={cancelEdit}>
									Cancelar
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Templates</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{(templates.data as any[])?.map((t: any) => (
							<div
								key={t._id.toString()}
								className="flex items-center justify-between p-3 border rounded"
							>
								<div>
									<p className="font-medium">{t.name}</p>
									<p className="text-sm text-muted-foreground">
										{t.type} -{" "}
										{t.subject || (t.content && t.content.slice(0, 30))}...
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => startEdit(t)}
									>
										Editar
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(t._id.toString())}
									>
										Deletar
									</Button>
								</div>
							</div>
						))}
						{(templates.data as any[])?.length === 0 && (
							<p className="text-muted-foreground">
								Nenhum template encontrado
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
