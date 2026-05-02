import type { CreateEnumType } from "@alextheman/utility";

import { az } from "@alextheman/utility";
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
  updatedAt: z.coerce.date().nullable(),
  publishedAt: z.coerce.date().nullable(),
});
export type Blog = z.infer<typeof blogSchema>;

export function parseBlog(input: unknown): Blog {
  return az.with(blogSchema).parse(input);
}
export function parseBlogs(input: unknown): Array<Blog> {
  return az.with(z.array(blogSchema)).parse(input);
}

export const blogRevisionSchema = z.object({
  id: z.int().positive(),
  editorId: z.uuid(),
  blogId: z.uuid("blog_id"),
  title: z.string().max(100),
  content: z.record(z.string(), z.any()),
  revision: z.int().positive(),
  revisionMessage: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});
export type BlogRevision = z.infer<typeof blogRevisionSchema>;

export function parseBlogRevision(input: unknown): BlogRevision {
  return az.with(blogRevisionSchema).parse(input);
}
export function parseBlogRevisionHistory(input: unknown): Array<BlogRevision> {
  return az.with(z.array(blogRevisionSchema)).parse(input);
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
  return az.with(blogStateHistorySchema).parse(input);
}
export function parseBlogStateHistory(input: unknown): Array<BlogStateHistoryRow> {
  return az.with(z.array(blogStateHistorySchema)).parse(input);
}

export const blogInsertSchema = z.object({
  id: z.uuid().optional(),
  authorId: z.uuid(),
  title: z.string(),
  content: z.record(z.string(), z.any()),
});

export type BlogInsertData = z.infer<typeof blogInsertSchema>;

export function parseBlogInsertData(input: unknown): BlogInsertData {
  return az.with(blogInsertSchema).parse(input);
}

export const blogViewSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  updatedAt: z.coerce.date().nullable(),
  publishedAt: z.coerce.date().nullable(),
  title: z.string(),
  content: z.record(z.string(), z.any()),
});

export type BlogView = z.infer<typeof blogViewSchema>;

export function parseBlogView(input: unknown): BlogView {
  return az.with(blogViewSchema).parse(input);
}
