import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionOptionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type BlogCollectionOption = z.infer<typeof blogCollectionOptionSchema>;

export function parseBlogCollectionOptions(input: unknown): Array<BlogCollectionOption> {
  return az.with(z.array(blogCollectionOptionSchema)).parse(input);
}
