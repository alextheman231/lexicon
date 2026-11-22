import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

export const blogSummarySchema = z.object({
  authorDisplayName: z.string().nullable(),
  authorId: z.uuid(),
  authorProfilePictureUrl: z.string().nullable(),
  authorUsername: z.string(),
  id: z.uuid(),
  publishedAt: z.coerce.date().nullable(),
  state: z.enum(BlogState),
  title: z.string(),
  updatedAt: z.coerce.date(),
});

export type BlogSummary = z.infer<typeof blogSummarySchema>;

export function parseBlogSummary(input: unknown): BlogSummary {
  return az.with(blogSummarySchema).parse(input);
}
export function parseBlogSummaries(input: unknown): Array<BlogSummary> {
  return az.with(z.array(blogSummarySchema)).parse(input);
}
