import type { DataError } from "@alextheman/utility/v6";
import type { ZodError } from "zod";

import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionItemSummarySchema = z.object({
  id: z.uuid(),
  itemNumber: z.int().positive(),
  createdAt: z.coerce.date(),
  blogId: z.uuid(),
  blogTitle: z.string(),
  authorId: z.uuid(),
  authorUsername: z.string(),
  authorDisplayName: z.string().nullable(),
  blogUpdatedAt: z.coerce.date(),
  blogPublishedAt: z.coerce.date().nullable(),
  blogCollectionId: z.uuid(),
});
export type BlogCollectionItemSummary = z.infer<typeof blogCollectionItemSummarySchema>;
export function parseBlogCollectionItemSummary<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: ErrorType | ((zodError: ZodError) => ErrorType | void),
): BlogCollectionItemSummary {
  return az.with(blogCollectionItemSummarySchema).parse(input, onError);
}
export function parseBlogCollectionItemSummaries<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: ErrorType | ((zodError: ZodError) => ErrorType | void),
): Array<BlogCollectionItemSummary> {
  return az.with(z.array(blogCollectionItemSummarySchema)).parse(input, onError);
}
