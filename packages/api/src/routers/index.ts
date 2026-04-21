import { protectedProcedure, publicProcedure, router } from "../index";
import { adminRouter } from "./admin";
import {
	billingRouter,
	notificationsRouter,
	templatesRouter,
} from "./notifications";
import { organizationRouter } from "./organization";

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
	billing: billingRouter,
	organization: organizationRouter,
	admin: adminRouter,
});
export type AppRouter = typeof appRouter;
