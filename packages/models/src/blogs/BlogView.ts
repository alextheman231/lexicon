import { az } from "@alextheman/utility";
import z from "zod";

import { blogSummarySchema } from "src/blogs/BlogSummary";

export const blogViewSchema = blogSummarySchema.extend({
  content: z.record(z.string(), z.any()),
});

export type BlogView = z.infer<typeof blogViewSchema>;

export function parseBlogView(input: unknown): BlogView {
  return az.with(blogViewSchema).parse(input);
}
