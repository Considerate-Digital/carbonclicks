import { test, expect } from "@playwright/test";

test.describe("New Account and Dashboard access", () => {
  let login_token;
  test("New account and dashboard access with connection page", async ({
    page,
  }) => {
    // go to the login page
    await page.goto("/dashboard/login");

    // add the test email address
    await page.fill(
      'input[name="email"]',
      "test_test_test_test@considerate.digital",
    );

    // accept the consent form
    await page.click('input[name="consent"]');

    // submit the form
    await page.click(".login-container form button");

    // wait for the page to run the form
    await page.waitForSelector(".login-token");

    // collect the login token
    const login_token_el = await page.locator(".login-token");

    login_token = await login_token_el.innerHTML();

    console.log("login token: " + login_token);

    await expect(login_token_el).toContainText(/.*/);

    // log in to the service using the new token
    await page.goto("/dashboard?login=" + login_token);

    await page.waitForSelector(".consent-connect-title");

    const title = await page.locator(".consent-connect-title");

    await expect(title).toHaveText(/Connect your website/);

    // check we get a connection page
    await expect(page).toHaveTitle(/Considerate Analytics/);
  });
});

test.describe("Dashboard", () => {
  let login_token;
  test("Check Overview page", async ({ page }) => {
    await page.goto("/dashboard?demo=true");
    await page.waitForSelector(".graph-title");
    const overviewTitle = await page.locator(".graph-title");
    await expect(overviewTitle).toHaveText(/Overview/);
  });

  // go to pages page
  test("Check Pages page", async ({ page }) => {
    await page.goto("/dashboard/pages?demo=true");
    await page.waitForSelector(".graph-title");
    const pageTitle = await page.locator(".graph-title");
    await expect(pageTitle).toHaveText(/Pages/);
  });

  test("Check Countries page", async ({ page }) => {
    await page.goto("/dashboard/countries?demo=true");
    await page.waitForSelector(".graph-title");
    const countriesTitle = await page.locator(".graph-title");
    await expect(countriesTitle).toHaveText(/Countries/);
  });

  test("Check Account change email", async ({ page }) => {
    await page.goto("/dashboard/account?demo=true");
    await page.waitForSelector(".title");
    await page.fill(
      '.change-email-container input[name="email"]',
      "test_test_test_test_email_change@considerate.digital",
    );
    await page.fill(
      '.change-email-container input[name="new_email"]',
      "alex@considerate.digital",
    );
    await page.click(".change-email-container button");
    await expect(await page.getByTestId("change-email-response")).toHaveText(
      "We have sent you an email. Please follow the link to change your email address.",
    );
  });

  test("Check Account delete", async ({ page }) => {
    await page.goto("/dashboard/account?demo=true");
    await page.waitForSelector(".title");
    await page.fill(
      '.delete-account-container input[name="email"]',
      "test_test_test_test_exists@considerate.digital",
    );
    await page.click('.delete-account-container input[name="consent"]');
    await page.click(".delete-account-container button");
    await page.waitForSelector(".login-title");
    await expect(await page.locator(".login-title")).toHaveText("Login");
  });
});

/*
test.describe('Contact Form', () => {
	test('should submit the form successfully', async ({ page }) => {
		// Navigate to the contact page
		await page.goto(import.meta.env.VITE_DOMAIN_ADDRESS + '/contac');

		// Fill in the form
		await page.fill('input[name="name"]', 'John Doe');
		await page.fill('input[name="email"]', 'johndoe@example.com');
		await page.fill('textarea[name="message"]', 'Hello, this is a test message.');

		// Submit the form
		await page.click('button[type="submit"]');

		// Wait for the confirmation message
		await page.waitForSelector('.message-container .sent');

		// Assert the success message is visible
		const successMessage = await page.textContent('.message-container .sent');
		expect(successMessage).toBe('Your message has been sent.');
	});

	test('should show validation errors for invalid email', async ({ page }) => {
		// Navigate to the contact page
		await page.goto('/contact');

		// Fill in the form with an invalid email
		await page.fill('input[name="name"]', 'John Doe');
		await page.fill('input[name="email"]', 'invalid-email');
		await page.fill('textarea[name="message"]', 'Hello, this is a test message.');

		// Submit the form
		await page.click('button[type="submit"]');

		// Wait for the validation error message
		await page.waitForSelector('.error-message');

		// Assert the error message is visible
		const errorMessage = await page.textContent('.error-message');
		expect(errorMessage).toBe('Please type a valid email address.');
	});

	test('should show validation errors for empty fields', async ({ page }) => {
		// Navigate to the contact page
		await page.goto('/contact');

		// Submit the form without filling in
		await page.click('button[type="submit"]');

		// Wait for the validation error messages
		await page.waitForSelector('.error-message');

		// Assert the error messages are visible
		const errorMessages = await page.locator('.error-message').allTextContents();
		expect(errorMessages).toContain('String cannot be empty');
	});
});
*/
