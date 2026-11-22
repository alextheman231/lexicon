import type { ObjectValue } from "@alextheman/utility";

export const BlogState = {
  ARCHIVED: "archived",
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type BlogState = ObjectValue<typeof BlogState>;

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
