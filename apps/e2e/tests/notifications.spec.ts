import { expect, test } from "@playwright/test";

test.describe("Notifications Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Signup to get a session
		await page.goto("/login", { timeout: 60000 });

		const nameInput = page.locator('input[name="name"]');
		await nameInput.waitFor({ state: "visible" });

		await nameInput.fill("Notify User");
		await page.fill('input[name="email"]', `notify-${Date.now()}@example.com`);
		await page.fill('input[name="password"]', "Password123!");

		await Promise.all([
			page.waitForURL(/\/dashboard/, { timeout: 15000 }),
			page.click('button[type="submit"]:has-text("Sign Up")'),
		]);
	});

	test("User can send an email notification", async ({ page }) => {
		// Fill Send Notification form
		await page.fill(
			'input[placeholder="email@example.com"]',
			"recipient@example.com",
		);
		await page.fill('input[placeholder="Assunto do email"]', "Test Subject");
		await page.fill(
			'textarea[placeholder="Digite a mensagem..."]',
			"Hello from E2E test!",
		);

		await page.click('button:has-text("Enviar")');

		// Check toast
		await expect(
			page.locator("text=Notificação enviada com sucesso!"),
		).toBeVisible();
	});

	test("User can send an SMS notification", async ({ page }) => {
		// Change type to SMS
		await page.click(
			'button:has([data-placeholder="Select a type"], :text("Email"))',
		);
		await page.click("text=SMS");

		await page.fill('input[placeholder="+5511999999999"]', "+1234567890");
		await page.fill(
			'textarea[placeholder="Digite a mensagem..."]',
			"SMS from E2E test!",
		);

		await page.click('button:has-text("Enviar")');

		// Check toast
		await expect(
			page.locator("text=Notificação enviada com sucesso!"),
		).toBeVisible();
	});
});
