import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";
import { SortDirection } from "src/SortDirection";

const blogFilterSchema = z.object({
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
