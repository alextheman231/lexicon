import type { PlaywrightTestConfig } from "@playwright/test";

import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const playwrightConfig: PlaywrightTestConfig = {
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5174",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  testMatch: "**/*.test.ts",
  projects: [
    process.env.CI
      ? null
      : {
          name: "setup",
          testMatch: "tests/setup.ts",
        },
    ...[
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      },
      {
        name: "Mobile Chrome",
        use: { ...devices["Pixel 5"] },
      },
    ].map(({ name, use }) => {
      if (process.env.CI) {
        return { name, use };
      }
      return { name, use, dependencies: ["setup"] };
    }),
  ].filter((item) => {
    return item !== null;
  }),
  webServer: [
    {
      command: "pnpm run start-end-to-end",
      cwd: "../back-end",
      port: 8081,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "pnpm run start-end-to-end",
      cwd: "../front-end",
      port: 5174,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
};

export default playwrightConfig;
