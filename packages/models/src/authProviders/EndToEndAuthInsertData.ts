import { az } from "@alextheman/utility";
import z from "zod";

export const endToEndAuthInsertSchema = z.object({
  email: z.email(),
});

export type EndToEndAuthInsertData = z.infer<typeof endToEndAuthInsertSchema>;
export function parseEndToEndAuthInsertData(input: unknown): EndToEndAuthInsertData {
  return az.with(endToEndAuthInsertSchema).parse(input);
}
