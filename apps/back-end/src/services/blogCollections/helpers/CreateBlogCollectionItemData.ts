import { az } from "@alextheman/utility";
import z from "zod";

export const createBlogCollectionItemDataSchema = z.object({
  blogId: z.uuid(),
});

export type CreateBlogCollectionItemData = z.infer<typeof createBlogCollectionItemDataSchema>;

export function parseCreateBlogCollectionItemData(input: unknown): CreateBlogCollectionItemData {
  return az.with(createBlogCollectionItemDataSchema).parse(input);
}
