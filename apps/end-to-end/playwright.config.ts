import type { PlaywrightTestConfig } from "@playwright/test";

import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const playwrightConfig: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:6173",
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
        use: devices["Desktop Chrome"],
      },
      {
        name: "webkit",
        use: devices["Desktop Safari"],
      },
      {
        name: "mobile-chrome",
        use: devices["Pixel 5"],
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
      port: 9090,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "pnpm run start-end-to-end",
      cwd: "../front-end",
      port: 6173,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
};

export default playwrightConfig;
