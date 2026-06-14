import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { personalRestrictedImports, sortObjects } from "@alextheman/eslint-plugin/internal";
import { combineRestrictedImports } from "@alextheman/eslint-plugin/utility";
import perfectionist from "eslint-plugin-perfectionist";

const backendMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        combineRestrictedImports(personalRestrictedImports, {
          paths: [
            {
              name: "src/database/connection.ts",
              importNames: ["setConnection"],
              message:
                "Do not manually set the database connection outside of tests/configuration files.",
            },
          ],
        }),
      ],
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
