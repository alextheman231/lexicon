import type { UserConfig } from "tsdown";

const config: UserConfig = {
  clean: true,
  deps: {
    neverBundle: ["zod"],
  },
  dts: true,
  entry: ["src/index.ts"],
  fixedExtension: false,
  format: ["esm", "cjs"],
};

export default config;
