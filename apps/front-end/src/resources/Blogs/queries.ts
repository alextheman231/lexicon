import type { BlogInsertData, BlogSummary, BlogView } from "@lexicon/models";

import { az } from "@alextheman/utility";
import { parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

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

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: BlogInsertData) => {
      const { data } = await lexiconAuthenticatedClient.post("/api/v1/blogs", blog);
      return az.with(z.uuid()).parse(data.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs() });
    },
  });
}
