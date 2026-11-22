import type { DataError } from "@alextheman/utility/v6";
import type { ZodError } from "zod";

import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionItemSummarySchema = z.object({
  authorDisplayName: z.string().nullable(),
  authorId: z.uuid(),
  authorProfilePictureUrl: z.string().nullable(),
  authorUsername: z.string(),
  blogCollectionId: z.uuid(),
  blogId: z.uuid(),
  blogPublishedAt: z.coerce.date().nullable(),
  blogTitle: z.string(),
  blogUpdatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  id: z.uuid(),
  itemNumber: z.int().positive(),
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
