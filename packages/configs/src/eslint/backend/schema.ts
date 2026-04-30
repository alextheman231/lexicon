import type { Linter } from "eslint";

import { sortObjects } from "@alextheman/eslint-plugin/internal";
import perfectionist from "eslint-plugin-perfectionist";

import backendMain from "src/eslint/backend/main";

const backendSchema: Array<Linter.Config> = [
  ...backendMain,
  {
    files: ["**/*.ts"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-objects": ["error", sortObjects],
    },
  },
];

export default backendSchema;
