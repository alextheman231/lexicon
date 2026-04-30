import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { personalRestrictedImports } from "@alextheman/eslint-plugin/internal";
import { combineRestrictedImports } from "@alextheman/eslint-plugin/utility";

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
];

export default backendMain;
