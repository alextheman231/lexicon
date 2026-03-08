import alexPlugin from "@alextheman/eslint-plugin";

export default [
  ...alexPlugin.configs["combined/typescript"],
  ...alexPlugin.configs["general/package-json"],
];
