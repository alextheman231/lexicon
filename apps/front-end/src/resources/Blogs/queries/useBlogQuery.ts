import type { BlogView } from "@lexicon/models";

import { parseBlogView } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

function useBlogQuery(blogId: string) {
  return useQuery<BlogView>({
    queryKey: queryKeys.blogs({ blogId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/blogs/${blogId}`);
      return parseBlogView(data.blog);
    },
  });
}

export default useBlogQuery;
