import alexPlugin from "@alextheman/eslint-plugin";

export default [
  ...alexPlugin.configs["combined/typescript"],
  ...alexPlugin.configs["internal/package-json"],
  {
    rules: {
      "package-json/require-exports": "off",
    },
  },
];
