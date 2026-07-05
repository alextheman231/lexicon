import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionSchema = z.object({
  id: z.uuid(),
  name: z.string().max(100),
  userId: z.uuid(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export type BlogCollection = z.infer<typeof blogCollectionSchema>;

export function parseBlogCollection(input: unknown): BlogCollection {
  return az.with(blogCollectionSchema).parse(input);
}
