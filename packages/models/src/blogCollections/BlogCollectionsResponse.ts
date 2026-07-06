import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionViewSchema } from "src/blogCollections/BlogCollectionView";

export const blogCollectionsResponseSchema = z.object({
  blogCollections: z.array(blogCollectionViewSchema),
  count: z.int(),
});

export type BlogCollectionsResponse = z.infer<typeof blogCollectionsResponseSchema>;

export function parseBlogCollectionsResponse(input: unknown): BlogCollectionsResponse {
  return az.with(blogCollectionsResponseSchema).parse(input);
}
