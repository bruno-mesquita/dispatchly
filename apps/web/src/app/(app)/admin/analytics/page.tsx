import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { AnalyticsOverview } from "./analytics-overview";

export default async function AdminAnalyticsPage() {
	const session = await authClient.getSession({
		fetchOptions: { headers: await headers(), throw: true },
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <AnalyticsOverview />;
}
