import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

export const signInDataSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignInData = z.infer<typeof signInDataSchema>;

export function parseSignInData<ErrorType extends Error = DataError>(
  input: unknown,
  errorHandler?: AzParsingErrorHandler<ErrorType>,
): SignInData {
  return az.with(signInDataSchema).parse(input, errorHandler);
}
