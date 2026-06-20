import type { CreateBlogData } from "@lexicon/models";

import { az } from "@alextheman/utility";
import z from "zod";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function useCreateBlogMutation() {
  const invalidate = useQueryInvalidation("blogs");

  return useMutation({
    mutationFn: async (blog: CreateBlogData) => {
      const { data } = await lexiconAuthenticatedClient.post("/api/v1/blogs", blog);
      return az.with(z.uuid()).parse(data.id);
    },
    onSuccess: invalidate,
  });
}

export default useCreateBlogMutation;
