import {
	Organization as OrganizationModel,
	Subscription as SubscriptionModel,
} from "@dispatchly/db";
import { env } from "@dispatchly/env/server";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const CRON_QUEUE_NAME = "billing-cron";
const RESET_USAGE_JOB = "reset-usage-sweep";
const DAILY_PATTERN = "0 3 * * *";

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const billingCronQueue = new Queue(CRON_QUEUE_NAME, { connection });

export async function runMonthlyResetSweep(): Promise<{
	scanned: number;
	reset: number;
}> {
	const subs = await SubscriptionModel.find({
		status: { $in: ["active", "trialing"] },
		currentPeriodStart: { $ne: null },
	}).lean();

	let reset = 0;
	for (const sub of subs) {
		if (!sub.currentPeriodStart) continue;
		const org = await OrganizationModel.findOne({ _id: sub.orgId }).lean();
		if (!org) continue;

		const lastReset = (org as { lastResetAt?: Date }).lastResetAt;
		if (lastReset && lastReset >= sub.currentPeriodStart) continue;

		await OrganizationModel.updateOne(
			{ _id: sub.orgId },
			{
				$set: {
					"usage.emails": 0,
					"usage.sms": 0,
					"usage.push": 0,
					lastResetAt: new Date(),
				},
			},
		);
		reset += 1;
	}

	return { scanned: subs.length, reset };
}

let cronWorker: Worker | null = null;

export async function startBillingCron(): Promise<void> {
	await billingCronQueue.add(
		RESET_USAGE_JOB,
		{},
		{
			repeat: { pattern: DAILY_PATTERN },
			jobId: RESET_USAGE_JOB,
			removeOnComplete: 100,
			removeOnFail: 50,
		},
	);

	if (cronWorker) return;
	cronWorker = new Worker(
		CRON_QUEUE_NAME,
		async (job) => {
			if (job.name === RESET_USAGE_JOB) {
				return runMonthlyResetSweep();
			}
			return null;
		},
		{ connection },
	);

	cronWorker.on("completed", (job, result) => {
		console.log(`[billing-cron] ${job.name} ok`, result);
	});
	cronWorker.on("failed", (job, err) => {
		console.error(`[billing-cron] ${job?.name} failed:`, err.message);
	});
}

export async function stopBillingCron(): Promise<void> {
	if (cronWorker) {
		await cronWorker.close();
		cronWorker = null;
	}
}
