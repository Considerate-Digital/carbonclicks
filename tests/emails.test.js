import { test, expect } from "@playwright/test";
test.describe("Contact form", () => {
  test("Contact form email test", async ({ page }) => {
    // go to the account page
    await page.goto("/dashboard/account?demo=true");

    await page.waitForSelector(".contact-container");
    // add the test form data
    await page.fill(
      '.contact-container input[name="name"]',
      "test test test test",
    );
    // note the different email here, so that we bypass the checks
    await page.fill(
      '.contact-container input[name="email"]',
      "email_test_test_test_test@considerate.digital",
    );
    await page.fill(
      '.contact-container textarea[name="message"]',
      "test_test_test_test",
    );

    // submit the form
    await page.click(".contact-container form button");

    console.log("TODO: Check you have recieved the contact form email");
    await expect(await page.getByTestId("contact-form-response")).toHaveText(
      "Your message has been sent.",
    );
  });
});
/*
test.describe('Dashboard', () => {
	let login_token;
	test('Check Overview page', async ({ page }) => {
		await page.goto("/dashboard?demo=true");
		await page.waitForSelector('.graph-title');
		const overviewTitle = await page.locator('.graph-title');
		await expect(overviewTitle).toHaveText(/Overview/);
	});

		// go to pages page
	test('Check Pages page', async ({ page }) => {
		await page.goto("/dashboard/pages?demo=true");
		await page.waitForSelector('.graph-title');
		const pageTitle = await page.locator('.graph-title');
		await expect(pageTitle).toHaveText(/Pages/);
	});

	test('Check Countries page', async ({ page }) => {
		await page.goto("/dashboard/countries?demo=true");
		await page.waitForSelector('.graph-title');
		const countriesTitle = await page.locator('.graph-title');
		await expect(countriesTitle).toHaveText(/Countries/);
	});

	test('Check Account change email', async ({ page }) => {
		await page.goto("/dashboard/account?demo=true");
		await page.waitForSelector('.title');
		await page.fill('.change-email-container input[name="email"]', "test_test_test_test@considerate.digital"); 
		await page.fill('.change-email-container input[name="new_email"]', "test_test_test_test_new@considerate.digital"); 
		await page.click('.change-email-container button');
		await expect(await page.getByTestId("change-email-response")).toHaveText("We have sent you an email. Please follow the link to change your email address.");
	});

	test('Check Account delete', async ({ page }) => {
		await page.goto("/dashboard/account?demo=true");
		await page.waitForSelector('.title');
		await page.fill('.delete-account-container input[name="email"]', "test_test_test_test@considerate.digital"); 
		await page.click('.delete-account-container input[name="consent"]');
		await page.click('.delete-account-container button');
		await expect(await page.getByTestId("delete-account-response")).toHaveText("We have deleted your user account and sent you an email to confirm this action.");
	});
});
	*/
