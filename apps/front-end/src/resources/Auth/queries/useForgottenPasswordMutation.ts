import type { ForgottenPasswordData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useForgottenPasswordMutation() {
  return useMutation({
    mutationFn: async (user: ForgottenPasswordData) => {
      await lexiconAuthenticatedClient.put("/api/v1/auth/forgotten-password", user);
    },
  });
}

export default useForgottenPasswordMutation;
