import type { BlogInsertData, BlogSummary, BlogView } from "@lexicon/models";

import type { PaginatedResult, PaginationSettings } from "src/hooks/usePagination";

import { az } from "@alextheman/utility";
import { parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

export function useBlogsQuery(
  params?: Partial<PaginationSettings<BlogSummary> & { authorId: string }>,
) {
  return useQuery<PaginatedResult<BlogSummary>>({
    queryKey: queryKeys.blogs(params),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/blogs", { params });
      return {
        rows: parseBlogSummaries(data.blogs),
        totalRecordCount: az.with(z.int()).parse(data.count),
      };
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
