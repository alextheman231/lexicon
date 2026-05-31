import type { Page } from "@playwright/test";

import { test as playwrightTest } from "@playwright/test";

interface LexiconTestFixtures {
  authenticatedPage: Page;
}

const test = playwrightTest.extend<LexiconTestFixtures>({
  authenticatedPage: async ({ context }, use) => {
    await context.request.post(`${process.env.API_BASE_URL}/api/v1/auth/end-to-end`, {
      data: {
        email: "test@lexiconblogs.com",
      },
    });

    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export default test;
