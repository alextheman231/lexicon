import { az } from "@alextheman/utility";
import z from "zod";

export const metadataSchema = z.object({
  commitHash: z.string().nullable(),
});

export type Metadata = z.infer<typeof metadataSchema>;

export function parseMetadata(input: unknown): Metadata {
  return az.with(metadataSchema).parse(input);
}
