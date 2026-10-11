import alexPlugin from "@alextheman/eslint-plugin";
import { backendMain } from "@lexicon/configs";

export default [
  ...backendMain,
  ...alexPlugin.configs["internal/package-json"],
  {
    rules: {
      "package-json/require-exports": "off",
    },
  },
];
