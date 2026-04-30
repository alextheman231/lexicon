import type { Linter } from "eslint";

import alexPlugin from "@alextheman/eslint-plugin";
import { personalRestrictedImports } from "@alextheman/eslint-plugin/internal";
import { combineRestrictedImports } from "@alextheman/eslint-plugin/utility";

const frontendMain: Array<Linter.Config> = [
  ...alexPlugin.configs["combined/typescript"],
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        combineRestrictedImports(personalRestrictedImports, {
          paths: [
            ...["QueryBoundary", "QueryBoundaryDataMap", "QueryBoundaryProvider"].map(
              (importName) => {
                return {
                  importNames: [importName],
                  name: "@alextheman/components",
                  message: `Use the internal ${importName} from src/components/${importName} instead.`,
                };
              },
            ),
          ],
        }),
      ],
    },
  },
];

export default frontendMain;
