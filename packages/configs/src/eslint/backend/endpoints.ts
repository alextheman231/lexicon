import type { Linter } from "eslint";

import backendMain from "src/eslint/backend/main";
import endpointRestrictedImports from "src/eslint/backend/restrictedImports/endpointRestrictedImports";

const backendEndpoints: Array<Linter.Config> = [
  ...backendMain,
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", endpointRestrictedImports],
    },
  },
];

export default backendEndpoints;
