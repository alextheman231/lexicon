import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionSchema } from "src/blogCollections/BlogCollection";

export const blogCollectionsResponseSchema = z.object({
  blogCollections: z.array(blogCollectionSchema),
  count: z.int(),
});

export type BlogCollectionsResponse = z.infer<typeof blogCollectionsResponseSchema>;

export function parseBlogCollectionsResponse(input: unknown): BlogCollectionsResponse {
  return az.with(blogCollectionsResponseSchema).parse(input);
}
