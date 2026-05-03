import type { BlogSummary, BlogView } from "@lexicon/models";

import { parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { useQuery } from "@tanstack/react-query";

import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

export function useBlogsQuery() {
  return useQuery<Array<BlogSummary>>({
    queryKey: queryKeys.blogs(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/blogs");
      return parseBlogSummaries(data.blogs);
    },
  });
}

export function useBlogQuery(blogId: string) {
  return useQuery<BlogView>({
    queryKey: queryKeys.blogs({ blogId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/blogs/${blogId}`);
      return parseBlogView(data.blog);
    },
  });
}
