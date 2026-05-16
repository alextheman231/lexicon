import type {
  CreateQueryBoundaryParameters,
  DefaultQueryBoundaryComponents,
} from "@alextheman/components";
import type { JSX } from "react";

import type { QueryBoundaryProviderProps } from "src/components/QueryBoundaryProvider";

import { createQueryBoundary as createAlexQueryBoundary } from "@alextheman/components";

import QueryBoundaryDataMap from "src/components/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";

export interface LexiconQueryBoundaryComponents<DataType> extends Omit<
  DefaultQueryBoundaryComponents<DataType>,
  "Context" | "DataMap"
> {
  Context: (
    props: Omit<QueryBoundaryProviderProps<DataType>, "isLoading" | "error" | "data">,
  ) => JSX.Element;
  DataMap: typeof QueryBoundaryDataMap<DataType>;
  DataRowsMap: typeof QueryBoundaryDataRowsMap<DataType>;
}

function createQueryBoundary<DataType>(
  params: CreateQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponents<DataType> {
  const QueryBoundary = createAlexQueryBoundary(params);

  return {
    ...QueryBoundary,
    Context: ({ children, errorComponent, errorFunction, codeErrorMap, ...props }) => {
      const query = {
        isLoading: params.query.isLoading,
        error: params.query.error,
        data: params.query.data ?? params.query.dataCollection,
      };

      if (errorComponent) {
        return (
          <QueryBoundaryProvider {...query} errorComponent={errorComponent} {...props}>
            {children}
          </QueryBoundaryProvider>
        );
      }

      if (errorFunction || codeErrorMap) {
        return (
          <QueryBoundaryProvider
            {...query}
            codeErrorMap={codeErrorMap}
            errorFunction={errorFunction}
          >
            {children}
          </QueryBoundaryProvider>
        );
      }

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
