import type { DataError } from "@alextheman/utility/v6";
import type { ZodError } from "zod";

import { az, SortDirection } from "@alextheman/utility";
import z from "zod";

export const blogCollectionItemsFilterSchema = z.object({
  pageNumber: az.fieldNumber().int().optional(),
  pageSize: az.fieldNumber().int().optional(),
  sortColumn: z.enum(["itemNumber"]).optional(),
  sortDirection: z.enum(SortDirection).optional(),
});
export type BlogCollectionItemsFilter = z.infer<typeof blogCollectionItemsFilterSchema>;
export function parseBlogCollectionItemsFilter<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: ErrorType | ((zodError: ZodError) => ErrorType | void),
) {
  return az.with(blogCollectionItemsFilterSchema).parse(input, onError);
}
