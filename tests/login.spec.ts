import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("should login and reach the dashboard", async ({ page }) => {
    // Go to login page
    await page.goto("http://localhost:5173/");
    await expect(page.locator("h2")).toHaveText(/login/i);
    await expect(page.locator("input[id='user_id']")).toBeDefined();

    // Fill in credentials
    await page.fill('input[id="user_id"]', "alice");
    await page.fill('input[id="password"]', "1234");

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation and check for dashboard
    await expect(page.locator("h2")).toHaveText(/dashboard/i);
  });
});

// TODO: create tests to user fetching and data fetching
