import type { UserConfig } from "tsdown";

const config: UserConfig = {
  clean: true,
  dts: true,
  entry: ["src/cli/index.ts"],
  fixedExtension: false,
  format: ["esm"],
};

export default config;
