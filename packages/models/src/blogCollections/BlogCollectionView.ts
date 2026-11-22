import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionSchema } from "src/blogCollections/BlogCollection";

export const blogCollectionViewSchema = blogCollectionSchema.extend({
  itemCount: z.int().nonnegative(),
  userDisplayName: z.string().nullable(),
  userProfilePictureUrl: z.string().nullable(),
  username: z.string(),
});

export type BlogCollectionView = z.infer<typeof blogCollectionViewSchema>;

export function parseBlogCollectionView(input: unknown): BlogCollectionView {
  return az.with(blogCollectionViewSchema).parse(input);
}
