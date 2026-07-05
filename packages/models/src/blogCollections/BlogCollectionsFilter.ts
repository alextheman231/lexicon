import { az, SortDirection } from "@alextheman/utility";
import z from "zod";

export const blogCollectionsFilterSchema = z.object({
  userId: z.uuid().optional(),
  pageNumber: az.fieldNumber().int().optional(),
  pageSize: az.fieldNumber().int().optional(),
  sortColumn: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(SortDirection).optional(),
});

export type BlogCollectionsFilter = z.infer<typeof blogCollectionsFilterSchema>;

export function parseBlogCollectionsFilter(input: unknown): BlogCollectionsFilter {
  return az.with(blogCollectionsFilterSchema).parse(input);
}
