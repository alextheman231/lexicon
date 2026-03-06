const alexCLineConfig = {
  preCommit: {
    packageManager: "pnpm",
    steps: [
      ["build", { arguments: ["--ui=stream"] }],
      ["format", { arguments: ["--ui=stream"] }],
      ["lint", { arguments: ["--ui=stream"] }],
    ],
  },
  template: {
    pullRequest: {
      category: "general",
      projectType: "app",
    }
  }
};

export default alexCLineConfig;
