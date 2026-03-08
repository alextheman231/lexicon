import type { Blog, BlogRevision, BlogStateHistoryRow } from "@lexicon/schema";

import { parseZodSchema } from "@alextheman/utility";
import { blogRevisionsTable, blogsTable, BlogState, blogStateHistoryTable } from "@lexicon/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const blogSchema = createSelectSchema(blogsTable);

export function parseBlog(input: unknown): Blog {
  return parseZodSchema(blogSchema, input);
}
export function parseBlogs(input: unknown): Array<Blog> {
  return parseZodSchema(z.array(blogSchema), input);
}

export const blogRevisionSchema = createSelectSchema(blogRevisionsTable);

export function parseBlogRevision(input: unknown): BlogRevision {
  return parseZodSchema(blogRevisionSchema, input);
}
export function parseBlogRevisionHistory(input: unknown): Array<BlogRevision> {
  return parseZodSchema(z.array(blogRevisionSchema), input);
}

export const blogStateHistorySchema = createSelectSchema(blogStateHistoryTable, {
  state: z.enum(BlogState),
});
export type BlogStateHistory = Array<BlogStateHistoryRow>;

export function parseBlogStateHistoryRow(input: unknown): BlogStateHistoryRow {
  return parseZodSchema(blogStateHistorySchema, input);
}
export function parseBlogStateHistory(input: unknown): Array<BlogStateHistoryRow> {
  return parseZodSchema(z.array(blogStateHistorySchema), input);
}

export type { Blog, BlogRevision };
export { BlogState };
