import type { CreateUserData } from "@lexicon/models";

import { az } from "@alextheman/utility";
import z from "zod";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useSignUpMutation() {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (user: CreateUserData) => {
      const { data } = await lexiconAuthenticatedClient.post("/api/v1/users", user);
      return az.with(z.uuid()).parse(data.id);
    },
    onSuccess: invalidate,
  });
}

export default useSignUpMutation;
