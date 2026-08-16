import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

export const blogSummarySchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  authorUsername: z.string(),
  authorDisplayName: z.string().nullable(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().nullable(),
  state: z.enum(BlogState),
  title: z.string(),
});

export type BlogSummary = z.infer<typeof blogSummarySchema>;

export function parseBlogSummary(input: unknown): BlogSummary {
  return az.with(blogSummarySchema).parse(input);
}
export function parseBlogSummaries(input: unknown): Array<BlogSummary> {
  return az.with(z.array(blogSummarySchema)).parse(input);
}
