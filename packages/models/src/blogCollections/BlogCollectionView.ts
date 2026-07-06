import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionSchema } from "src/blogCollections/BlogCollection";

export const blogCollectionViewSchema = blogCollectionSchema.extend({
  username: z.string(),
  userDisplayName: z.string().nullable(),
  itemCount: z.int().nonnegative(),
});

export type BlogCollectionView = z.infer<typeof blogCollectionViewSchema>;

export function parseBlogCollectionView(input: unknown): BlogCollectionView {
  return az.with(blogCollectionViewSchema).parse(input);
}
