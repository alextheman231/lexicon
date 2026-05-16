import type {
  CreateQueryBoundaryParameters,
  DefaultQueryBoundaryComponents,
} from "@alextheman/components";

import { createQueryBoundary as createAlexQueryBoundary } from "@alextheman/components";

import QueryBoundaryDataMap from "src/components/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryError from "src/components/QueryBoundaryError";
import QueryBoundaryFallback from "src/components/QueryBoundaryFallback";

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
