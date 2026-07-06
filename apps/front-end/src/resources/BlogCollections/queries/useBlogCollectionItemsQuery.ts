import type { BlogCollectionItemsResponse, BlogCollectionItemSummary } from "@lexicon/models";

import type { PaginationSettings } from "src/hooks/usePagination";

import { parseBlogCollectionItemsResponse } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useBlogCollectionItemsQuery(
  blogCollectionId: string,
  params: Partial<PaginationSettings<BlogCollectionItemSummary>>,
) {
  return useQuery<BlogCollectionItemsResponse>({
    queryKey: queryKeys.blogCollections({ blogCollectionId }, params),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(
        `/api/v1/blog-collections/${blogCollectionId}/items`,
        { params },
      );
      return parseBlogCollectionItemsResponse(data);
    },
  });
}

export default useBlogCollectionItemsQuery;
