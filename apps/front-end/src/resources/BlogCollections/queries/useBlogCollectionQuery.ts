import type { BlogCollectionView } from "@lexicon/models";

import { parseBlogCollectionView } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useBlogCollectionQuery(blogCollectionId: string) {
  return useQuery<BlogCollectionView>({
    queryKey: queryKeys.blogCollections({ blogCollectionId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(
        `/api/v1/blog-collections/${blogCollectionId}`,
      );
      return parseBlogCollectionView(data.blogCollection);
    },
  });
}

export default useBlogCollectionQuery;
