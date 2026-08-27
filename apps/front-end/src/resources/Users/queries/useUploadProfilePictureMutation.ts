import { createFormData } from "@alextheman/utility";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useUploadProfilePictureMutation() {
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async (file: File) => {
      await lexiconAuthenticatedClient.put(
        "/api/v1/current-user/profile-picture",
        createFormData({ file }),
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    },
    onSuccess: invalidate,
  });
}

export default useUploadProfilePictureMutation;
