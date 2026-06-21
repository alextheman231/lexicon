import type { Page } from "@playwright/test";

import { test as playwrightTest } from "@playwright/test";

interface LexiconTestFixtures {
  authenticatedPage: Page;
}

const test = playwrightTest.extend<LexiconTestFixtures>({
  authenticatedPage: async ({ context }, use, testInfo) => {
    await context.request.post(`/api/v1/auth/end-to-end`, {
      data: {
        email: `test-${testInfo.project.name}@lexiconblogs.com`,
      },
    });

    const page = await context.newPage();
    await use(page);
  },
});

export default test;
