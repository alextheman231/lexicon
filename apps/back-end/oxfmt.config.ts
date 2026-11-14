import type { OxfmtConfig } from "oxfmt";

const config: OxfmtConfig = {
  ignorePatterns: ["dist/**", "pnpm-lock.yaml", "src/database/migrations/meta"],
};

export default config;
