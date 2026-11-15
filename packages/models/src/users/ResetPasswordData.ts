import { az } from "@alextheman/utility";
import z from "zod";

export const resetPasswordDataSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(256),
});

export type ResetPasswordData = z.infer<typeof resetPasswordDataSchema>;

export function parseResetPasswordData(input: unknown): ResetPasswordData {
  return az.with(resetPasswordDataSchema).parse(input);
}
