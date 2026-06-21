import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { sortObjects } from "@alextheman/eslint-plugin/internal";
import perfectionist from "eslint-plugin-perfectionist";

import baseRestrictedImports from "src/eslint/backend/restrictedImports/baseRestrictedImports";

const backendMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", baseRestrictedImports],
    },
  },
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
