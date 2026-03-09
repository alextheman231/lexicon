import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  fixedExtension: false,
  deps: {
    onlyAllowBundle: false,
  },
};

export default config;
