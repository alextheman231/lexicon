import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  fixedExtension: false,
  deps: {
    neverBundle: ["zod"],
  },
};

export default config;
