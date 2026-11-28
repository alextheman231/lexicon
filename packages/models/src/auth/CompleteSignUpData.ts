import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

export const completeSignUpDataSchema = z.object({
  password: z.string().min(8).max(256),
  passwordAgain: z.string(),
  token: z.string(),
});

export type CompleteSignUpData = z.infer<typeof completeSignUpDataSchema>;

export function parseCompleteSignUpData<ErrorType extends Error = DataError>(
  input: unknown,
  errorHandler?: AzParsingErrorHandler<ErrorType>,
): CompleteSignUpData {
  return az.with(completeSignUpDataSchema).parse(input, errorHandler);
}
