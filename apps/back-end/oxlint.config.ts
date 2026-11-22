import type { OxlintConfig } from "oxlint";

import { oxlintConfigBase } from "@alextheman/configs/oxlint";

const baseConfig = oxlintConfigBase({
  sortObjectKeysInFiles: ["src/**/index.ts", "src/database/schema/**.ts"],
});

const config: OxlintConfig = {
  extends: [baseConfig],
  rules: {
    "typescript/consistent-return": "off",
  },
};

export default config;
