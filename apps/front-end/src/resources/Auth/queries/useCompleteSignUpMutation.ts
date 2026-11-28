import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useCompleteSignUpMutation(token: string) {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (password: string) => {
      await lexiconAuthenticatedClient.put("/api/v1/auth/complete-sign-up", { password, token });
    },
    onSuccess: invalidate,
  });
}

export default useCompleteSignUpMutation;
