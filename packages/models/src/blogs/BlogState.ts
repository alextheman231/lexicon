import type { CreateEnumType } from "@alextheman/utility";

export const BlogState = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type BlogState = CreateEnumType<typeof BlogState>;

export function formatBlogState(value: BlogState) {
  switch (value) {
    case BlogState.ARCHIVED: {
      return "Archived";
    }
    case BlogState.DRAFT: {
      return "Draft";
    }
    case BlogState.PUBLISHED: {
      return "Published";
    }
    default: {
      throw value satisfies never;
    }
  }
}
