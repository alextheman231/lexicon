import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

export const resetPasswordDataSchema = z.object({
  password: z.string().min(8).max(256),
  passwordAgain: z.string(),
  token: z.string(),
});

export type ResetPasswordData = z.infer<typeof resetPasswordDataSchema>;

export function parseResetPasswordData<ErrorType extends Error = DataError>(
  input: unknown,
  errorHandler?: AzParsingErrorHandler<ErrorType>,
): ResetPasswordData {
  return az.with(resetPasswordDataSchema).parse(input, errorHandler);
}
