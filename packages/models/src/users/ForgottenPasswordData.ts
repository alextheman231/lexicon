import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

export const forgottenPasswordDataSchema = z.object({
  email: z.email(),
});

export type ForgottenPasswordData = z.infer<typeof forgottenPasswordDataSchema>;

export function parseForgottenPasswordData<ErrorType extends Error = DataError>(
  input: unknown,
  errorHandler?: AzParsingErrorHandler<ErrorType>,
): ForgottenPasswordData {
  return az.with(forgottenPasswordDataSchema).parse(input, errorHandler);
}
