import type { CreateEnumType } from "@alextheman/utility";

export const SortDirection = {
  DESC: "desc",
  ASC: "asc",
} as const;

export type SortDirection = CreateEnumType<typeof SortDirection>;
