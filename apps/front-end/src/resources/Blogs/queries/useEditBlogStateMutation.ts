import type { EditBlogStateData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useEditBlogStateMutation(blogId: string) {
  const invalidate = useQueryInvalidation("blogs");

  return useMutation({
    mutationFn: async (data: EditBlogStateData) => {
      return await lexiconAuthenticatedClient.put(`/api/v1/blogs/${blogId}/state`, data);
    },
    onSuccess: invalidate,
  });
}

export default useEditBlogStateMutation;
