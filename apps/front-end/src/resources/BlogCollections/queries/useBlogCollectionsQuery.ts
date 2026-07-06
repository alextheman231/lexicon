import type { BlogCollectionsResponse, BlogCollectionView } from "@lexicon/models";

import type { PaginationSettings } from "src/hooks/usePagination";

import { parseBlogCollectionsResponse } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useBlogCollectionsQuery(
  params: Partial<PaginationSettings<BlogCollectionView> & { userId?: string }>,
) {
  return useQuery<BlogCollectionsResponse>({
    queryKey: queryKeys.blogCollections(params),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/blog-collections", { params });
      return parseBlogCollectionsResponse(data);
    },
  });
}

export default useBlogCollectionsQuery;
