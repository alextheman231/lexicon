import { az } from "@alextheman/utility";
import z from "zod";

import { blogSummarySchema } from "src/blogs/BlogSummary";

const blogSummariesResponseSchema = z.object({
  blogs: z.array(blogSummarySchema),
  count: z.int(),
});

export type BlogSummariesResponse = z.infer<typeof blogSummariesResponseSchema>;

export function parseBlogSummariesResponse(input: unknown): BlogSummariesResponse {
  return az.with(blogSummariesResponseSchema).parse(input);
}
