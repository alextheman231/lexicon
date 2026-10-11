import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { personalRestrictedImports, sortObjects } from "@alextheman/eslint-plugin/internal";
import { combineRestrictedImports } from "@alextheman/eslint-plugin/utility";
import perfectionist from "eslint-plugin-perfectionist";

const backendMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  {
    files: ["src/**/index.ts"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-objects": ["error", sortObjects],
    },
  },
  {
    files: ["{src,tests}/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        combineRestrictedImports(personalRestrictedImports, {
          paths: ["@alextheman/utility", "@alextheman/utility/v6"].map((name) => {
            return {
              importNames: ["DataError", "CodeError"],
              name,
              message: "Please use the corresponding error type from `src/utility/errors` instead.",
            };
          }),
        }),
      ],
    },
  },
];

export default backendMain;
