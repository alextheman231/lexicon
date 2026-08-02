import type { CreateBlogCollectionData } from "@lexicon/models";

import { parseUUID } from "@alextheman/utility";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useCreateBlogCollectionMutation() {
  const invalidate = useQueryInvalidation("blogCollections");
  return useMutation({
    mutationFn: async (mutationData: CreateBlogCollectionData) => {
      const { data } = await lexiconAuthenticatedClient.post(
        `/api/v1/blog-collections`,
        mutationData,
      );
      return parseUUID(data.id);
    },
    onSuccess: invalidate,
  });
}

export default useCreateBlogCollectionMutation;
