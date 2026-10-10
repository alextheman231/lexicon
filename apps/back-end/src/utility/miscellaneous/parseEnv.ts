import type { ObjectValue } from "@alextheman/utility";

import { Env as AlexEnv, az } from "@alextheman/utility";
import z from "zod";

export const Env = {
  ...AlexEnv,
  END_TO_END: "end-to-end",
} as const;
export type Env = ObjectValue<typeof Env>;

function parseEnv(input: unknown): Env {
  return az.with(z.enum(Env)).parse(input);
}

export default parseEnv;
