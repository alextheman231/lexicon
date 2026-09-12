import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { sortObjects } from "@alextheman/eslint-plugin/internal";
import perfectionist from "eslint-plugin-perfectionist";

const backendMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  {
    files: ["**/index.ts"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-objects": ["error", sortObjects],
    },
  },
];

export default backendMain;
