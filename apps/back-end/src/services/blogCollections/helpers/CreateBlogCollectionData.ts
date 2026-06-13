import { az } from "@alextheman/utility";
import z from "zod";

import { createBlogCollectionItemDataSchema } from "src/services/blogCollections/helpers/CreateBlogCollectionItemData";

export const createBlogCollectionDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  items: z.array(createBlogCollectionItemDataSchema).nullable().optional(),
});

export type CreateBlogCollectionData = z.infer<typeof createBlogCollectionDataSchema>;

export function parseCreateBlogCollectionData(input: unknown): CreateBlogCollectionData {
  return az.with(createBlogCollectionDataSchema).parse(input);
}
