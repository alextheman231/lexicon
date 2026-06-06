import { normaliseIndents, UUID_PATTERN } from "@alextheman/utility";
import { expect } from "@playwright/test";

import test from "tests/fixtures";

test.describe("Blog creation", () => {
  test("Can create a blog and publish it immediately", async ({ authenticatedPage, baseURL }) => {
    await authenticatedPage.goto("/");
    await authenticatedPage.getByLabel("User options").click();
    const createBlogOption = authenticatedPage.getByText("Create Blog");
    await createBlogOption.click();

    await authenticatedPage.getByLabel("Title").fill("Standards");
    const editor = authenticatedPage.locator('[data-lexical-editor="true"]');

    const content = normaliseIndents`
        Think you're ready to push and show
        I've found problems you'd better know!
        People think that I'm too picky
        But I just guard the gates of quality!
        
        Sort those objects
        Check that spelling
        I just wanna get you to your best!
        Missing symbol
        Check that spacing
        Put your work to the test!

        I'm checking! I'm checking!
        Checking for no mistyped things!
        I'm checking! I'm checking!
        Making sure your work's all in order!
        I'm checking! I'm checking!
        You sure this is your best work?
        I just do this 'cause I care and
        I have standards, you'd better have some too!
    `;

    await editor.fill(content);

    const submitButton = authenticatedPage.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}$`));
    expect(authenticatedPage.url()).toMatch(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}$`));
    const title = authenticatedPage.getByText("Standards").first();
    await expect(title).toBeVisible();
    await expect(authenticatedPage.getByText(content)).toBeVisible();
  });
});
