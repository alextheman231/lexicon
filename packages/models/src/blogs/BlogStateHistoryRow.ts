import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

export const blogStateHistorySchema = z.object({
  blogId: z.uuid(),
  id: z.int().positive(),
  revisionId: z.uuid(),
  state: z.enum(BlogState),
  updatedAt: z.coerce.date(),
  updatedById: z.uuid(),
});
export type BlogStateHistoryRow = z.infer<typeof blogStateHistorySchema>;

export function parseBlogStateHistoryRow(input: unknown): BlogStateHistoryRow {
  return az.with(blogStateHistorySchema).parse(input);
}
export function parseBlogStateHistory(input: unknown): Array<BlogStateHistoryRow> {
  return az.with(z.array(blogStateHistorySchema)).parse(input);
}
