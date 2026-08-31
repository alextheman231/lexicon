import type { UserConfig } from "tsdown";

const tsdownConfig: Array<UserConfig> = [
  {
    entry: ["src/server/index.ts"],
    outDir: "dist/server",
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
    deps: {
      neverBundle: ["@alextheman/utility", "zod"],
    },
    sourcemap: true,
  },
  {
    entry: ["src/workers/index.ts"],
    outDir: "dist/workers",
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
    deps: {
      neverBundle: ["@alextheman/utility", "zod"],
    },
    sourcemap: true,
  },
];

export default tsdownConfig;
