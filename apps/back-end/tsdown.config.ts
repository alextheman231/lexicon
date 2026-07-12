import type { UserConfig } from "tsdown";

const tsdownConfig: UserConfig = {
  entry: ["src/server/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  fixedExtension: false,
  deps: {
    neverBundle: ["@alextheman/utility", "zod"],
  },
  sourcemap: true,
};

export default tsdownConfig;
