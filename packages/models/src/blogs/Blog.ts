import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

const blogSchema = z.object({
  authorId: z.uuid(),
  currentRevisionId: z.uuid(),
  id: z.uuid(),
  publishedAt: z.coerce.date().nullable(),
  state: z.enum(BlogState),
  updatedAt: z.coerce.date(),
});

export type Blog = z.infer<typeof blogSchema>;

export function parseBlog(input: unknown): Blog {
  return az.with(blogSchema).parse(input);
}
export function parseBlogs(input: unknown): Array<Blog> {
  return az.with(z.array(blogSchema)).parse(input);
}
