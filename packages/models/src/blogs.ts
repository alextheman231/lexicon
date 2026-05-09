import type { CreateEnumType } from "@alextheman/utility";

import { az, omitProperties } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import z from "zod";

import { SortDirection } from "src/SortDirection";

export const BlogState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;
export type BlogState = CreateEnumType<typeof BlogState>;

export const blogSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  state: z.enum(BlogState),
  currentRevisionId: z.int().positive(),
  updatedAt: z.coerce.date(),
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

export const blogInsertSchema = z.strictObject({
  title: z.string(),
  content: z.record(z.string(), z.any()),
  state: z.enum(omitProperties(BlogState, "ARCHIVED")),
});

export const blogUpdateSchema = blogInsertSchema
  .omit({
    state: true,
  })
  .extend({
    state: z.enum(BlogState),
  });

export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;
export function parseBlogUpdateData(input: unknown): BlogUpdateData {
  return az.with(blogUpdateSchema).parse(input);
}

export type BlogInsertData = z.infer<typeof blogInsertSchema>;
export function parseBlogInsertData(input: unknown): BlogInsertData {
  return az.with(blogInsertSchema).parse(
    input,
    new APIError(400, "INVALID_INSERT_DATA", "The provided blog data to create is invalid", {
      input,
    }),
  );
}

export const blogSummarySchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  authorUsername: z.string(),
  authorDisplayName: z.string(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().nullable(),
  state: z.enum(BlogState),
  title: z.string(),
});

export const blogViewSchema = blogSummarySchema.extend({
  content: z.record(z.string(), z.any()),
});

export type BlogView = z.infer<typeof blogViewSchema>;
export type BlogSummary = z.infer<typeof blogSummarySchema>;

export function parseBlogView(input: unknown): BlogView {
  return az.with(blogViewSchema).parse(input);
}
export function parseBlogSummary(input: unknown): BlogSummary {
  return az.with(blogSummarySchema).parse(input);
}
export function parseBlogSummaries(input: unknown): Array<BlogSummary> {
  return az.with(z.array(blogSummarySchema)).parse(input);
}

export const blogFilterSchema = z.object({
  authorId: z.uuid().optional(),
  state: z.enum(BlogState).optional(),
  pageNumber: az.fieldNumber().int().optional(),
  pageSize: az.fieldNumber().int().optional(),
  sortColumn: z.enum(["updatedAt", "publishedAt", "state", "title"]).optional(),
  sortDirection: z.enum(SortDirection).optional(),
});

export type BlogFilter = z.infer<typeof blogFilterSchema>;

export function parseBlogFilter(input: unknown): BlogFilter {
  return az.with(blogFilterSchema).parse(input);
}

export const blogSummariesResponseSchema = z.object({
  blogs: z.array(blogSummarySchema),
  count: z.int(),
});

export type BlogSummariesResponse = z.infer<typeof blogSummariesResponseSchema>;

export function parseBlogSummariesResponse(input: unknown): BlogSummariesResponse {
  return az.with(blogSummariesResponseSchema).parse(input);
}
