import type { EditBlogData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useEditBlogMutation(blogId: string) {
  const invalidate = useQueryInvalidation("blogs");

  return useMutation({
    mutationFn: async (blog: EditBlogData) => {
      return await lexiconAuthenticatedClient.put(`/api/v1/blogs/${blogId}`, blog);
    },
    onSuccess: invalidate,
  });
}

export default useEditBlogMutation;
