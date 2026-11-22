import type { PlaywrightTestConfig } from "@playwright/test";

import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const playwrightConfig: PlaywrightTestConfig = {
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
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
  ],
  reporter: [["html", { open: "never" }], ["list"]],
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  testMatch: "**/*.test.ts",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:9090",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: "pnpm run start-end-to-end",
      cwd: "../back-end",
      port: 9090,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
};

export default playwrightConfig;
