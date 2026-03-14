import { UserProjectConfigExport } from "vitest/config";

const vitestConfig: UserProjectConfigExport = {
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/tests/**/*.test.ts"],
    setupFiles: ["tests/transaction.ts"],
  },
};

export default vitestConfig;
