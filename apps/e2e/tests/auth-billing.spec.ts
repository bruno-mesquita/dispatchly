import { expect, test } from "@playwright/test";

test.describe("Auth and Billing Flow", () => {
	test("User can sign up and reach dashboard", async ({ page }) => {
		// Heavy Next.js cold start
		await page.goto("/login", { timeout: 60000 });

		// Wait for form instead of immediate fill to skip Loader states
		const nameInput = page.locator('input[name="name"]');
		await nameInput.waitFor({ state: "visible" });

		await nameInput.fill("Test User");
		await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
		await page.fill('input[name="password"]', "Password123!");

		// Sync navigation
		await Promise.all([
			page.waitForURL(/\/dashboard/, { timeout: 15000 }),
			page.click('button[type="submit"]:has-text("Sign Up")'),
		]);

		await expect(page.locator("h1")).toContainText("Dashboard");
	});

	test("User can see billing panel and trigger upgrade", async ({ page }) => {
		await page.goto("/login", { timeout: 60000 });

		const nameInput = page.locator('input[name="name"]');
		await nameInput.waitFor({ state: "visible" });

		await nameInput.fill("Test User");
		await page.fill(
			'input[name="email"]',
			`test-billing-${Date.now()}@example.com`,
		);
		await page.fill('input[name="password"]', "Password123!");

		await Promise.all([
			page.waitForURL(/\/dashboard/, { timeout: 15000 }),
			page.click('button[type="submit"]:has-text("Sign Up")'),
		]);

		await expect(page.locator("text=Plano Atual")).toBeVisible();

		// Click Upgrade on Basic plan
		await page.click('button:has-text("Upgrade") >> nth=0');
	});
});
