import type { Metadata } from "@lexicon/models";

import { parseMetadata } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useMetadataQuery() {
  return useQuery<Metadata>({
    queryKey: queryKeys.metadata(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/metadata");
      return parseMetadata(data);
    },
  });
}

export default useMetadataQuery;
