import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: ["src/cli/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  fixedExtension: false,
};

export default config;
