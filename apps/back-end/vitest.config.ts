import { UserProjectConfigExport } from "vitest/config";

const vitestConfig: UserProjectConfigExport = {
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/tests/**/*.test.ts"],
    setupFiles: ["tests/redisStoreMock.ts", "tests/isolation.ts"],
    globalSetup: ["tests/setup.ts"],
  },
};

export default vitestConfig;
