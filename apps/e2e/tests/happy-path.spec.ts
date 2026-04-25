import { expect, test } from "@playwright/test";

test.describe("GA Happy Path Flow", () => {
	const userEmail = `user-${Date.now()}@example.com`;

	test("Signup -> Create Template -> Send Notification -> Verify Log", async ({
		page,
	}) => {
		// 1. Signup
		await page.goto("/login");
		await page.fill('input[name="name"]', "GA User");
		await page.fill('input[name="email"]', userEmail);
		await page.fill('input[name="password"]', "Password123!");

		await Promise.all([
			page.waitForURL(/\/dashboard/),
			page.click('button[type="submit"]:has-text("Sign Up")'),
		]);

		// 2. Create Template
		await page.goto("/dashboard/templates");
		await page.click('button:has-text("Novo Template")');
		await page.fill('input[placeholder="Nome do template"]', "Welcome Email");
		await page.fill(
			'input[placeholder="Assunto (para email)"]',
			"Welcome to Dispatchly, {{name}}!",
		);
		await page.fill(
			'textarea[placeholder="Conteúdo do template"]',
			"Hi {{name}}, your account is ready.",
		);
		await page.click('button:has-text("Salvar Template")');

		await expect(page.locator("text=Welcome Email")).toBeVisible();

		// 3. Send Notification using Template
		await page.goto("/dashboard/send");
		// Fill details
		await page.fill(
			'input[placeholder="email@example.com"]',
			"customer@example.com",
		);

		// Select Template (assuming a select component is there)
		await page.click('button:has-text("Selecionar template...")');
		await page.click("text=Welcome Email");

		// Fill Variables
		await page.fill('input[placeholder="name"]', "John Doe");

		await page.click('button:has-text("Enviar")');

		// 4. Verify Success & Log
		await expect(
			page.locator("text=Notificação enviada com sucesso!"),
		).toBeVisible();

		await page.goto("/dashboard/logs");
		await expect(page.locator("text=customer@example.com")).toBeVisible();
		await expect(page.locator("text=Welcome Email")).toBeVisible();
	});
});
