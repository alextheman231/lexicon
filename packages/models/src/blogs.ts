import type { CreateEnumType } from "@alextheman/utility";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

export const BlogState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;
export type BlogState = CreateEnumType<typeof BlogState>;

export const blogSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  currentRevisionId: z.int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  publishedAt: z.coerce.date().nullable(),
});
export type Blog = z.infer<typeof blogSchema>;

export function parseBlog(input: unknown): Blog {
  return parseZodSchema(blogSchema, input);
}
export function parseBlogs(input: unknown): Array<Blog> {
  return parseZodSchema(z.array(blogSchema), input);
}

export const blogRevisionSchema = z.object({
  id: z.int().positive(),
  editorId: z.uuid(),
  blogId: z.uuid("blog_id"),
  title: z.string().max(100),
  content: z.record(z.string(), z.any()),
  revision: z.int().positive(),
  revisionMessage: z.string(),
  createdAt: z.coerce.date(),
});
export type BlogRevision = z.infer<typeof blogRevisionSchema>;

export function parseBlogRevision(input: unknown): BlogRevision {
  return parseZodSchema(blogRevisionSchema, input);
}
export function parseBlogRevisionHistory(input: unknown): Array<BlogRevision> {
  return parseZodSchema(z.array(blogRevisionSchema), input);
}

export const blogStateHistorySchema = z.object({
  id: z.int().positive(),
  updatedById: z.uuid(),
  blogId: z.uuid(),
  state: z.enum(BlogState),
  revisionId: z.int().positive(),
  updatedAt: z.coerce.date(),
});
export type BlogStateHistoryRow = z.infer<typeof blogStateHistorySchema>;
export type BlogStateHistory = Array<BlogStateHistoryRow>;

export function parseBlogStateHistoryRow(input: unknown): BlogStateHistoryRow {
  return parseZodSchema(blogStateHistorySchema, input);
}
export function parseBlogStateHistory(input: unknown): Array<BlogStateHistoryRow> {
  return parseZodSchema(z.array(blogStateHistorySchema), input);
}
