import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("Can view the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Welcome to Lexicon!" })).toBeVisible();
  });
});
