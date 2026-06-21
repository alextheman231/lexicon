import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import type { CreateEnumType } from "@alextheman/utility";

import { Env as AlexEnv, az } from "@alextheman/utility";
import z from "zod";

const Env = {
  ...AlexEnv,
  END_TO_END: "end-to-end",
} as const;
type Env = CreateEnumType<typeof Env>;

function parseEnv(input: unknown): Env {
  return az.with(z.enum(Env)).parse(input);
}

const ENV = parseEnv(process.env.NODE_ENV ?? "development");
const FRONT_END_PORT = ENV === "end-to-end" ? 6173 : 5173;
const BACK_END_PORT = ENV === "end-to-end" ? 9090 : 8080;

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: FRONT_END_PORT,
    proxy: {
      "^/api/v\\d+": {
        target: `http://localhost:${BACK_END_PORT}`,
        headers: {
          host: `localhost:${BACK_END_PORT}`,
        },
      },
      "^/static/": {
        target: `http://localhost:${BACK_END_PORT}`,
        headers: {
          host: `localhost:${BACK_END_PORT}`,
        },
      },
    },
  },
});
