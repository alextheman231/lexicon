import type {
  CreateQueryBoundaryParameters,
  DefaultQueryBoundaryComponents,
} from "@alextheman/components";

import { createQueryBoundary as createAlexQueryBoundary } from "@alextheman/components";

import QueryBoundaryDataMap from "src/groups/QueryBoundary/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/groups/QueryBoundary/QueryBoundaryDataRowsMap";
import QueryBoundaryError from "src/groups/QueryBoundary/QueryBoundaryError";
import QueryBoundaryFallback from "src/groups/QueryBoundary/QueryBoundaryFallback";

export interface LexiconQueryBoundaryComponents<DataType> extends Omit<
  DefaultQueryBoundaryComponents<DataType>,
  "Error" | "DataMap" | "Fallback"
> {
  Error: typeof QueryBoundaryError;
  Fallback: typeof QueryBoundaryFallback;
  DataMap: typeof QueryBoundaryDataMap<DataType>;
  DataRowsMap: typeof QueryBoundaryDataRowsMap<DataType>;
}

function createQueryBoundary<DataType>(
  params: CreateQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponents<DataType> {
  const QueryBoundary = createAlexQueryBoundary(params);

  return {
    ...QueryBoundary,
    Error: QueryBoundaryError,
    Fallback: QueryBoundaryFallback,
    DataMap: QueryBoundaryDataMap<DataType>,
    DataRowsMap: QueryBoundaryDataRowsMap<DataType>,
  };
}

export default createQueryBoundary;
