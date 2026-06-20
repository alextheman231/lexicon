import type { EditBlogData } from "@lexicon/models";

import { useQueryClient } from "@tanstack/react-query";

import useMutation from "src/hooks/query/useMutation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import { relatedQueryKeys } from "src/utility/query/queryKeys";

function useEditBlogMutation(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: EditBlogData) => {
      await lexiconAuthenticatedClient.put(`/api/v1/blogs/${blogId}`, blog);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: relatedQueryKeys.blogs });
    },
  });
}

export default useEditBlogMutation;
