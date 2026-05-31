import { expect } from "@playwright/test";

import test from "tests/fixtures";

test.describe("Authentication", () => {
  test("Can see a sign-in button if not signed in", async ({ page }) => {
    await page.goto("/");
    // The sign-in button is actually a link, as it's declared as a Material UI Button with component={ExternalLink}.
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });
  test("Can see the user dropdown trigger with the user's display name if signed in", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.getByRole("button", { name: "Test User" })).toBeVisible();
  });
});
