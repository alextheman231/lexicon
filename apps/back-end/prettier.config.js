import { prettierConfig } from "@alextheman/eslint-plugin";
import prettierPluginSql from "prettier-plugin-sql";

export default { ...prettierConfig, plugins: [prettierPluginSql], language: "postgresql" };
