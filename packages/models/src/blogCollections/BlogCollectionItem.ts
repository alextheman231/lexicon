import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionItemSchema = z.object({
  blogCollectionId: z.uuid(),
  blogId: z.uuid(),
  createdAt: z.coerce.date(),
  id: z.uuid(),
  itemNumber: z.int().positive(),
});

export type BlogCollectionItem = z.infer<typeof blogCollectionItemSchema>;

export function parseBlogCollectionItem(input: unknown): BlogCollectionItem {
  return az.with(blogCollectionItemSchema).parse(input);
}
