import { blogRevisionsTable, blogsTable } from "src/database/schema";

export const BlogSortColumn = {
  updatedAt: blogsTable.updatedAt,
  publishedAt: blogsTable.publishedAt,
  state: blogsTable.state,
  title: blogRevisionsTable.title,
} as const;
