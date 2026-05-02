import { protectedProcedure, publicProcedure, router } from "../index.js";
import { adminRouter } from "./admin.js";
import { billingRouter } from "./billing.js";
import { journeysRouter } from "./journeys.js";
import { notificationsRouter } from "./notifications.js";
import { organizationRouter } from "./organization.js";
import { templatesRouter } from "./templates.js";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	notifications: notificationsRouter,
	templates: templatesRouter,
	journeys: journeysRouter,
	billing: billingRouter,
	organization: organizationRouter,
	admin: adminRouter,
});

export type AppRouter = typeof appRouter;
