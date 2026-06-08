import type { CreateEnumType } from "@alextheman/utility";

export const BlogState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type BlogState = CreateEnumType<typeof BlogState>;
