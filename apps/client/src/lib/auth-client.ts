import { stripeClient } from "@better-auth/stripe/client";
import { env } from "@dispatchly/env/web";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	plugins: [organizationClient(), adminClient(), stripeClient()],
});
