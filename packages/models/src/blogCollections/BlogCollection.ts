import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionSchema = z.object({
  createdAt: z.coerce.date(),
  description: z.string().nullable(),
  id: z.uuid(),
  name: z.string().max(100),
  userId: z.uuid(),
});

export type BlogCollection = z.infer<typeof blogCollectionSchema>;

export function parseBlogCollection(input: unknown): BlogCollection {
  return az.with(blogCollectionSchema).parse(input);
}
