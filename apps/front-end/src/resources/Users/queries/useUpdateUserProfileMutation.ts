import type { UserProfileFormOutputData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useUpdateUserProfileMutation() {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (data: UserProfileFormOutputData) => {
      await lexiconAuthenticatedClient.put("/api/v1/current-user/profile", data);
    },
    onSuccess: invalidate,
  });
}

export default useUpdateUserProfileMutation;
