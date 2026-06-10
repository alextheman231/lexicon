import type {
  CreateListQueryBoundaryParameters,
  QueryBoundaryDataMapProps,
} from "@alextheman/components/QueryBoundary";
import type { JSX } from "react";

import type { LexiconQueryBoundaryComponentsBase } from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";
import type { QueryBoundaryDataRowsMapProps } from "src/groups/QueryBoundary/QueryBoundaryDataRowsMap";

import createBaseQueryBoundary from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";
import QueryBoundaryDataMap from "src/groups/QueryBoundary/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/groups/QueryBoundary/QueryBoundaryDataRowsMap";

export interface LexiconQueryBoundaryComponentsList<
  ItemType,
> extends LexiconQueryBoundaryComponentsBase {
  DataMap: (
    props: Omit<QueryBoundaryDataMapProps<ItemType>, "data" | "isLoading" | "error">,
  ) => JSX.Element;
  DataRowsMap: (
    props: Omit<QueryBoundaryDataRowsMapProps<ItemType>, "data" | "isLoading" | "error">,
  ) => JSX.Element;
}

function createListQueryBoundary<ItemType>(
  params: CreateListQueryBoundaryParameters<ItemType>,
): LexiconQueryBoundaryComponentsList<ItemType> {
  const baseComponents = createBaseQueryBoundary(params);

  return {
    ...baseComponents,
    DataMap: ({ dataParser, itemParser, ...props }) => {
      if (dataParser !== undefined) {
        return <QueryBoundaryDataMap {...params.query} {...props} dataParser={dataParser} />;
      }
      if (itemParser !== undefined) {
        return <QueryBoundaryDataMap {...params.query} {...props} itemParser={itemParser} />;
      }
      return <QueryBoundaryDataMap {...params.query} {...props} />;
    },
    DataRowsMap: ({ undefinedFallback, nullFallback, nullableFallback, ...props }) => {
      if (nullableFallback !== undefined) {
        return (
          <QueryBoundaryDataRowsMap
            {...params.query}
            {...props}
            nullableFallback={nullableFallback}
          />
        );
      }
      if (undefinedFallback !== undefined || nullFallback !== undefined) {
        return (
          <QueryBoundaryDataRowsMap
            {...params.query}
            {...props}
            undefinedFallback={undefinedFallback}
            nullFallback={nullFallback}
          />
        );
      }
      return <QueryBoundaryDataRowsMap {...params.query} {...props} />;
    },
  };
}

export default createListQueryBoundary;
