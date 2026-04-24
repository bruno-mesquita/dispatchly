import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	/* Next.js dev server is heavy, run tests in series for stability */
	fullyParallel: false,
	workers: 1,
	/* Total timeout for each test */
	timeout: 120000,
	expect: {
		timeout: 15000,
	},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 1,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
		actionTimeout: 30000,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: [
		{
			command: "bun run dev:web",
			url: "http://localhost:3001",
			reuseExistingServer: !process.env.CI,
			cwd: "../..",
			timeout: 120000,
		},
		{
			command: "bun run dev:server",
			url: "http://localhost:3000/healthCheck",
			reuseExistingServer: !process.env.CI,
			cwd: "../..",
			timeout: 120000,
		},
	],
});
