import type { BlogRevision } from "@lexicon/models";

import { parseBlogRevisionHistory } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

function useBlogRevisionsQuery(blogId: string) {
  return useQuery<Array<BlogRevision>>({
    queryKey: queryKeys.blogs({ blogId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/blogs/${blogId}/revisions`);
      return parseBlogRevisionHistory(data.revisions);
    },
  });
}

export default useBlogRevisionsQuery;
