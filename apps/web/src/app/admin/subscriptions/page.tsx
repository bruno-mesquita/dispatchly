import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { SubscriptionsTable } from "./subscriptions-table";

export default async function AdminSubscriptionsPage() {
	const session = await authClient.getSession({
		fetchOptions: { headers: await headers(), throw: true },
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <SubscriptionsTable />;
}
