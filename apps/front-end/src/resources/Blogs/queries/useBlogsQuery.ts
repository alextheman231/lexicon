import type { BlogState, BlogSummary } from "@lexicon/models";

import type { PaginatedResult, PaginationSettings } from "src/hooks/usePagination";

import { az } from "@alextheman/utility";
import { parseBlogSummaries } from "@lexicon/models";
import z from "zod";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

function useBlogsQuery(
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

export default useBlogsQuery;
