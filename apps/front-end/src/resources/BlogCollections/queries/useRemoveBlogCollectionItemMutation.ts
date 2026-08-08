import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useRemoveBlogCollectionItemMutation(
  blogCollectionId: string,
  blogCollectionItemId: string,
) {
  const invalidate = useQueryInvalidation("blogCollections");
  return useMutation({
    mutationFn: async () => {
      await lexiconAuthenticatedClient.delete(
        `/api/v1/blog-collections/${blogCollectionId}/items/${blogCollectionItemId}`,
      );
    },
    onSuccess: invalidate,
  });
}

export default useRemoveBlogCollectionItemMutation;
