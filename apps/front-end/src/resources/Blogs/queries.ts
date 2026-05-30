import type {
  BlogState,
  BlogSummary,
  BlogView,
  CreateBlogData,
  EditBlogData,
} from "@lexicon/models";

import type { PaginatedResult, PaginationSettings } from "src/hooks/usePagination";

import { az } from "@alextheman/utility";
import { parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { useQueryClient } from "@tanstack/react-query";
import z from "zod";

import useMutation from "src/hooks/query/useMutation";
import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys, { relatedQueryKeys } from "src/utility/queryKeys";

export function useBlogsQuery(
  params?: Partial<PaginationSettings<BlogSummary> & { authorId: string; state: BlogState }>,
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
    mutationFn: async (blog: CreateBlogData) => {
      const { data } = await lexiconAuthenticatedClient.post("/api/v1/blogs", blog);
      return az.with(z.uuid()).parse(data.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs() });
    },
  });
}

export function useEditBlogMutation(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: EditBlogData) => {
      await lexiconAuthenticatedClient.put(`/api/v1/blogs/${blogId}`, blog);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: relatedQueryKeys.blogs });
    },
  });
}
