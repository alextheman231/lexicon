import type { QueryBoundaryDataMapProps } from "@alextheman/components/QueryBoundary";
import type { ReactNode } from "react";

import { SkeletonRow } from "@alextheman/components";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import QueryBoundaryDataMap from "src/groups/QueryBoundary/QueryBoundaryDataMap";

type FallbackComponent = ReactNode | ((columns: number) => ReactNode);

export interface QueryBoundaryDataRowsMapBaseProps {
  columns: number;
  emptyFallback?: FallbackComponent;
  loadingFallback?: ReactNode | ((columns: number) => ReactNode);
}
export interface QueryBoundaryDataRowsPropsNullable extends QueryBoundaryDataRowsMapBaseProps {
  nullableFallback?: FallbackComponent;
  undefinedFallback?: never;
  nullFallback?: never;
}

export interface QueryBoundaryDataRowsPropsUndefinedOrNull extends QueryBoundaryDataRowsMapBaseProps {
  nullableFallback?: never;
  undefinedFallback?: FallbackComponent;
  nullFallback?: FallbackComponent;
}

export type QueryBoundaryDataRowsMapProps<ItemType> = Omit<
  QueryBoundaryDataMapProps<ItemType>,
  "emptyFallback" | "loadingFallback" | "undefinedFallback" | "nullFallback" | "nullableFallback"
> &
  (QueryBoundaryDataRowsPropsNullable | QueryBoundaryDataRowsPropsUndefinedOrNull);

function QueryBoundaryDataRowsMap<ItemType>({
  columns,
  loadingFallback = (columns) => {
    return <SkeletonRow columns={columns} />;
  },
  emptyFallback = (columns) => {
    return (
      <TableRow>
        <TableCell colSpan={columns}>No data found.</TableCell>
      </TableRow>
    );
  },
  undefinedFallback,
  nullFallback,
  nullableFallback = (columns) => {
    return (
      <TableRow>
        <TableCell colSpan={columns}>No data available.</TableCell>
      </TableRow>
    );
  },
  children,
  itemParser,
  dataParser,
  ...props
}: QueryBoundaryDataRowsMapProps<ItemType>) {
  const resolvedLoadingFallback =
    typeof loadingFallback === "function" ? loadingFallback(columns) : loadingFallback;
  const resolvedEmptyFallback =
    typeof emptyFallback === "function" ? emptyFallback(columns) : emptyFallback;
  const resolvedUndefinedFallback =
    typeof undefinedFallback === "function" ? undefinedFallback(columns) : undefinedFallback;
  const resolvedNullFallback =
    typeof nullFallback === "function" ? nullFallback(columns) : nullFallback;
  const resolvedNullableFallback =
    typeof nullableFallback === "function" ? nullableFallback(columns) : nullableFallback;

  if (dataParser) {
    if (resolvedNullableFallback !== undefined) {
      return (
        <QueryBoundaryDataMap
          emptyFallback={resolvedEmptyFallback}
          loadingFallback={resolvedLoadingFallback}
          dataParser={dataParser}
          nullableFallback={resolvedNullableFallback}
          {...props}
        >
          {children}
        </QueryBoundaryDataMap>
      );
    }
    if (resolvedUndefinedFallback !== undefined || resolvedNullFallback !== undefined) {
      return (
        <QueryBoundaryDataMap
          emptyFallback={resolvedEmptyFallback}
          loadingFallback={resolvedLoadingFallback}
          undefinedFallback={resolvedUndefinedFallback}
          nullFallback={resolvedNullFallback}
          dataParser={dataParser}
          {...props}
        >
          {children}
        </QueryBoundaryDataMap>
      );
    }
    return (
      <QueryBoundaryDataMap
        emptyFallback={resolvedEmptyFallback}
        loadingFallback={resolvedLoadingFallback}
        dataParser={dataParser}
        {...props}
      >
        {children}
      </QueryBoundaryDataMap>
    );
  }

  if (itemParser) {
    if (resolvedNullableFallback !== undefined) {
      return (
        <QueryBoundaryDataMap
          emptyFallback={resolvedEmptyFallback}
          loadingFallback={resolvedLoadingFallback}
          itemParser={itemParser}
          nullableFallback={resolvedNullableFallback}
          {...props}
        >
          {children}
        </QueryBoundaryDataMap>
      );
    }
    if (resolvedUndefinedFallback !== undefined || resolvedNullFallback !== undefined) {
      return (
        <QueryBoundaryDataMap
          emptyFallback={resolvedEmptyFallback}
          loadingFallback={resolvedLoadingFallback}
          undefinedFallback={resolvedUndefinedFallback}
          nullFallback={resolvedNullFallback}
          itemParser={itemParser}
          {...props}
        >
          {children}
        </QueryBoundaryDataMap>
      );
    }
    return (
      <QueryBoundaryDataMap
        emptyFallback={resolvedEmptyFallback}
        loadingFallback={resolvedLoadingFallback}
        itemParser={itemParser}
        {...props}
      >
        {children}
      </QueryBoundaryDataMap>
    );
  }

  if (resolvedNullableFallback !== undefined) {
    return (
      <QueryBoundaryDataMap
        emptyFallback={resolvedEmptyFallback}
        loadingFallback={resolvedLoadingFallback}
        nullableFallback={resolvedNullableFallback}
        {...props}
      >
        {children}
      </QueryBoundaryDataMap>
    );
  }
  if (resolvedUndefinedFallback !== undefined || resolvedNullFallback !== undefined) {
    return (
      <QueryBoundaryDataMap
        emptyFallback={resolvedEmptyFallback}
        loadingFallback={resolvedLoadingFallback}
        undefinedFallback={resolvedUndefinedFallback}
        nullFallback={resolvedNullFallback}
        {...props}
      >
        {children}
      </QueryBoundaryDataMap>
    );
  }
  return (
    <QueryBoundaryDataMap
      emptyFallback={resolvedEmptyFallback}
      loadingFallback={resolvedLoadingFallback}
      {...props}
    >
      {children}
    </QueryBoundaryDataMap>
  );
}

export default QueryBoundaryDataRowsMap;
