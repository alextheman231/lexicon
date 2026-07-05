import { expect } from "@playwright/test";

import test from "tests/fixtures";

test.describe("Authentication", () => {
  test("Can see an options button if not signed in", async ({ page }) => {
    await page.goto("/");
    const userDropdownTrigger = page.getByLabel("User options");
    await expect(userDropdownTrigger).toBeVisible();
    expect(userDropdownTrigger).toHaveText("Options");
  });
  test("Can see the user dropdown trigger with the user's display name if signed in", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/");
    const userDropdownTrigger = authenticatedPage.getByLabel("User options");
    await expect(userDropdownTrigger).toBeVisible();
    expect(userDropdownTrigger).toHaveText("Test User");
  });
});
