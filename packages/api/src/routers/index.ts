import { protectedProcedure, publicProcedure, router } from "../index";
import {
	billingRouter,
	notificationsRouter,
	templatesRouter,
} from "./notifications";

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
});
export type AppRouter = typeof appRouter;
