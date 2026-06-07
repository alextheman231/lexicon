import type { UserProfileFormOutputData } from "@lexicon/models";

import { useQueryClient } from "@tanstack/react-query";

import useMutation from "src/hooks/query/useMutation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserProfileFormOutputData) => {
      await lexiconAuthenticatedClient.put("/api/v1/current-user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
  });
}

export default useUpdateUserProfileMutation;
