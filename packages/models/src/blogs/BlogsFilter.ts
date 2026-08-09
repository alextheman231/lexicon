import { az, SortDirection } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

const blogsFilterSchema = z.object({
  authorId: z.uuid().optional(),
  state: z.enum(BlogState).optional(),
  pageNumber: az.fieldNumber().int().optional(),
  pageSize: az.fieldNumber().int().optional(),
  sortColumn: z.enum(["updatedAt", "publishedAt", "state", "title"]).optional(),
  sortDirection: z.enum(SortDirection).optional(),
  searchQuery: z.string().optional(),
});

export type BlogsFilter = z.infer<typeof blogsFilterSchema>;

export function parseBlogsFilter(input: unknown): BlogsFilter {
  return az.with(blogsFilterSchema).parse(input);
}
