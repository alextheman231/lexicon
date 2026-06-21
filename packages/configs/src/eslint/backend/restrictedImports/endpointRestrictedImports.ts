import { combineRestrictedImports } from "@alextheman/eslint-plugin";

import baseRestrictedImports from "src/eslint/backend/restrictedImports/baseRestrictedImports";

const endpointRestrictedImports = combineRestrictedImports(baseRestrictedImports, {
  patterns: [
    {
      regex: String.raw`^src/services/(\w+)/mutations/(\w+)$`,
      message:
        "Please import the transaction-safe service from `src/services/**/mutations/transaction` instead.",
    },
  ],
});

export default endpointRestrictedImports;
