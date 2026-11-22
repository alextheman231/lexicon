import { az } from "@alextheman/utility";
import z from "zod";

export const resetPasswordDataSchema = z.object({
  password: z.string().min(8).max(256),
  token: z.string(),
});

export type ResetPasswordData = z.infer<typeof resetPasswordDataSchema>;

export function parseResetPasswordData(input: unknown): ResetPasswordData {
  return az.with(resetPasswordDataSchema).parse(input);
}
