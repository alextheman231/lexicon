import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";

const endToEndMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  ...alexPlugin.configs["internal/package-json"],
  {
    rules: {
      "package-json/require-exports": "off",
    },
  },
];

export default endToEndMain;
