import { az } from "@alextheman/utility";
import z from "zod";

export const completeSignUpDataSchema = z.object({
  password: z.string().min(8).max(256),
  token: z.string(),
});

export type CompleteSignUpData = z.infer<typeof completeSignUpDataSchema>;

export function parseCompleteSignUpData(input: unknown): CompleteSignUpData {
  return az.with(completeSignUpDataSchema).parse(input);
}
