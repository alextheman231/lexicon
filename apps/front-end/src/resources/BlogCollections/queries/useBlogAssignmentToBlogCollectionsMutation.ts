import type { PutBlogToBlogCollectionsData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useBlogAssignmentToBlogCollectionsMutation(blogId: string) {
  const invalidate = useQueryInvalidation("blogCollections");
  return useMutation({
    mutationFn: async (queryData: PutBlogToBlogCollectionsData) => {
      await lexiconAuthenticatedClient.put(`/api/v1/blogs/${blogId}/blog-collections`, queryData);
    },
    onSuccess: invalidate,
  });
}

export default useBlogAssignmentToBlogCollectionsMutation;
