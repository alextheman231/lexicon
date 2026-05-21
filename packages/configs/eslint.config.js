import alexPlugin from "@alextheman/eslint-plugin";

export default [
  ...alexPlugin.configs["combined/typescript"],
  ...alexPlugin.configs["internal/package-json"],
  {
    rules: {
      // Can probably be disabled because the peers are installed as dev workspace dependencies so this is a false positive.
      "package-json/specify-peers-locally": "off",
    },
  },
];
