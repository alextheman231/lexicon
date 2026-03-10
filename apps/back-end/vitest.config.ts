import { UserProjectConfigExport } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const vitestConfig: UserProjectConfigExport = {
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/tests/**/*.test.ts"],
    setupFiles: ["tests/transaction.ts"],
  },
};

export default vitestConfig;
