import type { BlogCollectionOption, BlogCollectionOptionsQueryString } from "@lexicon/models";

import { parseBlogCollectionOptions } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useBlogCollectionOptionsQuery(params: BlogCollectionOptionsQueryString = {}) {
  return useQuery<Array<BlogCollectionOption>>({
    queryKey: queryKeys.blogCollectionOptions(params),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/blog-collections/options", {
        params,
      });
      return parseBlogCollectionOptions(data.options);
    },
  });
}

export default useBlogCollectionOptionsQuery;
