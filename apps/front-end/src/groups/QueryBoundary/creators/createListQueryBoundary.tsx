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
    DataMap: ({
      dataParser,
      itemParser,
      undefinedFallback,
      nullFallback,
      nullableFallback,
      ...props
    }) => {
      if (dataParser !== undefined) {
        if (nullableFallback !== undefined) {
          return (
            <QueryBoundaryDataMap
              {...params.query}
              {...props}
              nullableFallback={nullableFallback}
              dataParser={dataParser}
            />
          );
        }
        if (undefinedFallback !== undefined || nullFallback !== undefined) {
          return (
            <QueryBoundaryDataMap
              {...params.query}
              {...props}
              undefinedFallback={undefinedFallback}
              nullFallback={nullFallback}
              dataParser={dataParser}
            />
          );
        }
        return <QueryBoundaryDataMap {...params.query} {...props} dataParser={dataParser} />;
      }

      if (itemParser !== undefined) {
        if (nullableFallback !== undefined) {
          return (
            <QueryBoundaryDataMap
              {...params.query}
              {...props}
              nullableFallback={nullableFallback}
              itemParser={itemParser}
            />
          );
        }
        if (undefinedFallback !== undefined || nullFallback !== undefined) {
          return (
            <QueryBoundaryDataMap
              {...params.query}
              {...props}
              undefinedFallback={undefinedFallback}
              nullFallback={nullFallback}
              itemParser={itemParser}
            />
          );
        }
        return <QueryBoundaryDataMap {...params.query} {...props} itemParser={itemParser} />;
      }

      if (nullableFallback !== undefined) {
        return (
          <QueryBoundaryDataMap {...params.query} {...props} nullableFallback={nullableFallback} />
        );
      }
      if (undefinedFallback !== undefined || nullFallback !== undefined) {
        return (
          <QueryBoundaryDataMap
            {...params.query}
            {...props}
            undefinedFallback={undefinedFallback}
            nullFallback={nullFallback}
          />
        );
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
