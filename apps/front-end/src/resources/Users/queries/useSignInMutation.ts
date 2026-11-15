import type { SignInData } from "@lexicon/models";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useSignInMutation() {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (signInData: SignInData) => {
      await lexiconAuthenticatedClient.post("/api/v1/auth/login", signInData);
    },
    onSuccess: invalidate,
  });
}

export default useSignInMutation;
