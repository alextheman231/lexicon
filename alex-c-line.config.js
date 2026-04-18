import path from "node:path";

const alexCLineConfig = {
  preCommit: {
    packageManager: "pnpm",
    steps: [
      ["build", { arguments: ["--ui=stream"] }],
      ["format", { arguments: ["--ui=stream"] }],
      ["lint", { arguments: ["--ui=stream"] }],
      async (stepRunner) => {
        await stepRunner({
          cwd: path.join(process.cwd(), "apps", "back-end"),
        })`pnpm run recreate-test-db`;
      },
      ["test", { arguments: ["--ui=stream"] }],
    ],
  },
  template: {
    pullRequest: {
      category: "general",
      projectType: "app",
    },
  },
};

export default alexCLineConfig;
