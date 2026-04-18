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

export function SendNotification() {
  const [type, setType] = useState<"email" | "sms" | "push">("email");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [variables, setVariables] = useState("{}");

  const sendMutation = useMutation(
    trpc.notifications.send.mutationOptions({
      onSuccess: () => {
        toast.success("Notificação enviada com sucesso!");
        setTo("");
        setSubject("");
        setContent("");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }),
  );

  const templates = useQuery(trpc.templates.list.queryOptions({ type }) as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let parsedVariables: Record<string, unknown> | undefined;
    if (templateId) {
      try {
        parsedVariables = JSON.parse(variables);
      } catch {
        toast.error("JSON inválido no campo de variáveis");
        return;
      }
    }

    try {
      await (sendMutation as any).mutateAsync({
        type,
        to,
        subject: type === "email" ? subject : undefined,
        content,
        templateId: templateId || undefined,
        variables: parsedVariables,
      });
    } catch (error: any) {
      toast.error(error?.message || "Erro ao enviar");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label>Destinatário</Label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={
                type === "email" ? "email@example.com" : "+5511999999999"
              }
              required
            />
          </div>

          {type === "email" && (
            <div className="space-y-2">
              <Label>Assunto</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Assunto do email"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Template (opcional)</Label>
            <Select
              value={templateId}
              onValueChange={(v: string | null) => v && setTemplateId(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {(templates.data as any[])?.map((t) => (
                  <SelectItem key={t._id?.toString()} value={t._id?.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                templateId
                  ? "Variáveis: use {{variavel}}"
                  : "Digite a mensagem..."
              }
              required
            />
          </div>

          {templateId && (
            <div className="space-y-2">
              <Label>Variáveis (JSON)</Label>
              <Input
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder='{"nome": "João"}'
              />
            </div>
          )}

          <Button type="submit" disabled={sendMutation.isPending}>
            {sendMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
