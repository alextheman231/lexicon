import { az } from "@alextheman/utility";
import z from "zod";

export const blogRevisionSchema = z.object({
  blogId: z.uuid("blog_id"),
  content: z.record(z.string(), z.any()),
  createdAt: z.coerce.date(),
  editorId: z.uuid(),
  id: z.uuid(),
  revisionMessage: z.string().nullable().optional(),
  title: z.string().max(100),
  version: z.int().positive(),
});

export type BlogRevision = z.infer<typeof blogRevisionSchema>;

export function parseBlogRevision(input: unknown): BlogRevision {
  return az.with(blogRevisionSchema).parse(input);
}
export function parseBlogRevisionHistory(input: unknown): Array<BlogRevision> {
  return az.with(z.array(blogRevisionSchema)).parse(input);
}
