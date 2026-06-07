import type { CreateBlogData } from "@lexicon/models";

import { az } from "@alextheman/utility";
import { useQueryClient } from "@tanstack/react-query";
import z from "zod";

import useMutation from "src/hooks/query/useMutation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

function useCreateBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: CreateBlogData) => {
      const { data } = await lexiconAuthenticatedClient.post("/api/v1/blogs", blog);
      return az.with(z.uuid()).parse(data.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs() });
    },
  });
}

export default useCreateBlogMutation;
