import { az } from "@alextheman/utility";
import z from "zod";

export const blogRevisionSchema = z.object({
  id: z.uuid(),
  editorId: z.uuid(),
  blogId: z.uuid("blog_id"),
  title: z.string().max(100),
  content: z.record(z.string(), z.any()),
  version: z.int().positive(),
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
