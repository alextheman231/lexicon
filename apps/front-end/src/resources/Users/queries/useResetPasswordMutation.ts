import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useResetPasswordMutation(token: string) {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (password: string) => {
      await lexiconAuthenticatedClient.put("/api/v1/auth/reset-password", { password, token });
    },
    onSuccess: invalidate,
  });
}

export default useResetPasswordMutation;
