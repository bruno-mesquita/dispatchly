"use client";

import { Button } from "@dispatchly/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@dispatchly/ui/components/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setError("Token de verificação ausente.");
			return;
		}

		const verify = async () => {
			try {
				await authClient.verifyEmail({
					query: { token },
				});
				setStatus("success");
			} catch (err) {
				setStatus("error");
				setError(
					err instanceof Error ? err.message : "Erro ao verificar e-mail.",
				);
			}
		};

		verify();
	}, [token]);

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Verificação de E-mail</CardTitle>
					<CardDescription>
						{status === "loading" && "Verificando seu endereço de e-mail..."}
						{status === "success" && "Seu e-mail foi verificado com sucesso!"}
						{status === "error" && "Ocorreu um problema na verificação."}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-6">
					{status === "loading" && (
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
					)}
					{status === "success" && (
						<CheckCircle2 className="h-12 w-12 text-green-500" />
					)}
					{status === "error" && (
						<XCircle className="h-12 w-12 text-destructive" />
					)}

					{error && (
						<p className="mt-4 text-center text-destructive text-sm">{error}</p>
					)}
				</CardContent>
				<CardFooter className="flex justify-center">
					{status === "success" ? (
						<Button asChild className="w-full">
							<Link href="/dashboard">Ir para o Dashboard</Link>
						</Button>
					) : (
						<Button asChild variant="outline" className="w-full">
							<Link href="/login">Voltar para o Login</Link>
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
