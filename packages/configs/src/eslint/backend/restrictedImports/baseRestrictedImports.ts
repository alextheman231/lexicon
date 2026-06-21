import { combineRestrictedImports } from "@alextheman/eslint-plugin";
import { personalRestrictedImports } from "@alextheman/eslint-plugin/internal";

const baseRestrictedImports = combineRestrictedImports(personalRestrictedImports, {
  paths: [
    {
      name: "src/database/connection.ts",
      importNames: ["setConnection"],
      message: "Do not manually set the database connection outside of tests/configuration files.",
    },
  ],
});

export default baseRestrictedImports;
