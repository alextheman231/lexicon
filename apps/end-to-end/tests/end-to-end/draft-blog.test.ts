import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { expect } from "@playwright/test";

import test from "tests/fixtures";

test.describe("Draft blog", () => {
  test("Can save a blog to drafts and then publish it", async ({ authenticatedPage, baseURL }) => {
    await authenticatedPage.goto("/blogs/new");
    await authenticatedPage.getByLabel("Title").fill("My Lexicon Blog");
    const editor = authenticatedPage.locator('[data-lexical-editor="true"]');

    const content = "This is my Lexicon blok";

    await editor.click();
    await authenticatedPage.keyboard.insertText(content);

    const draftButton = authenticatedPage.getByRole("button", { name: "Save and Exit" });
    await expect(draftButton).toBeEnabled();
    await Promise.all([
      authenticatedPage.waitForResponse((response) => {
        return (
          response.url().includes("/api/v1/blogs") &&
          response.request().method() === "POST" &&
          response.ok()
        );
      }),
      authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_REGEX_PATTERN}$`)),
      draftButton.click(),
    ]);

    await expect(authenticatedPage.getByText("Test User")).toBeVisible();
    await expect(authenticatedPage.getByText("Unpublished (saved as draft)")).toBeVisible();

    await authenticatedPage.getByLabel("Blog options").click();

    const editItem = authenticatedPage.getByRole("menuitem", { name: "Edit" });
    await expect(editItem).toBeVisible();
    await editItem.click();
    await authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_REGEX_PATTERN}/edit$`));

    const editedContent = "This is my Lexicon blog.";

    const editPageEditor = authenticatedPage.locator('[data-lexical-editor="true"]');

    await editPageEditor.click();
    await authenticatedPage.keyboard.press("Backspace");
    await authenticatedPage.keyboard.type("g.");

    const submitButton = authenticatedPage.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeEnabled();
    await Promise.all([
      authenticatedPage.waitForResponse((response) => {
        return (
          RegExp(`/api/v1/blogs/${UUID_REGEX_PATTERN}$`).test(response.url()) &&
          response.request().method() === "PUT" &&
          response.ok()
        );
      }),
      submitButton.click(),
      authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_REGEX_PATTERN}$`)),
    ]);

    const newTitle = authenticatedPage.getByText("My Lexicon Blog").first();
    await expect(newTitle).toBeVisible();
    await expect(authenticatedPage.getByText(editedContent)).toBeVisible();

    await expect(authenticatedPage.getByText("Test User")).toBeVisible();
    await expect(authenticatedPage.getByText("Today at")).toBeVisible();
  });
});
