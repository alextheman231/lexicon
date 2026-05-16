import type {
  CreateQueryBoundaryParameters,
  DefaultQueryBoundaryComponents,
} from "@alextheman/components";

import { createQueryBoundary as createAlexQueryBoundary } from "@alextheman/components";

import QueryBoundaryDataMap from "src/components/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";

export interface LexiconQueryBoundaryComponents<DataType> extends Omit<
  DefaultQueryBoundaryComponents<DataType>,
  "Context" | "DataMap"
> {
  Context: typeof QueryBoundaryProvider<DataType>;
  DataMap: typeof QueryBoundaryDataMap<DataType>;
  DataRowsMap: typeof QueryBoundaryDataRowsMap<DataType>;
}

function createQueryBoundary<DataType>(
  params: CreateQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponents<DataType> {
  const QueryBoundary = createAlexQueryBoundary(params);

  return {
    ...QueryBoundary,
    Context: ({ children, ...props }) => {
      return (
        <QueryBoundaryProvider
          isLoading={params.query.isLoading}
          error={params.query.error}
          data={params.query.data ?? params.query.dataCollection}
          {...props}
        >
          {children}
        </QueryBoundaryProvider>
      );
    },
    DataMap: QueryBoundaryDataMap<DataType>,
    DataRowsMap: QueryBoundaryDataRowsMap<DataType>,
  };
}

export default createQueryBoundary;
