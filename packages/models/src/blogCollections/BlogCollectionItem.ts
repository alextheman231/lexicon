import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionItemSchema = z.object({
  id: z.uuid(),
  itemNumber: z.int().positive(),
  blogId: z.uuid(),
  blogCollectionId: z.uuid(),
  createdAt: z.coerce.date(),
});

export type BlogCollectionItem = z.infer<typeof blogCollectionItemSchema>;

export function parseBlogCollectionItem(input: unknown): BlogCollectionItem {
  return az.with(blogCollectionItemSchema).parse(input);
}
