import type { QueryBoundaryDataMapProps } from "@alextheman/components/QueryBoundary";
import type { ReactNode } from "react";

import { SkeletonRow } from "@alextheman/components";
import { QueryBoundaryNullable } from "@alextheman/components/QueryBoundary";
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
  "emptyFallback" | "loadingFallback"
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

  let boundaryData = (
    <QueryBoundaryDataMap
      emptyFallback={resolvedEmptyFallback}
      loadingFallback={resolvedLoadingFallback}
      {...props}
    >
      {children}
    </QueryBoundaryDataMap>
  );

  if (dataParser) {
    boundaryData = (
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
    boundaryData = (
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

  let boundaryNullable = <QueryBoundaryNullable />;

  if (nullableFallback) {
    boundaryNullable = (
      <QueryBoundaryNullable
        data={props.data}
        error={props.error}
        isLoading={props.isLoading}
        nullableFallback={
          typeof nullableFallback === "function" ? nullableFallback(columns) : nullableFallback
        }
      />
    );
  }

  if (undefinedFallback || nullFallback) {
    boundaryNullable = (
      <QueryBoundaryNullable
        data={props.data}
        error={props.error}
        isLoading={props.isLoading}
        undefinedFallback={
          typeof undefinedFallback === "function" ? undefinedFallback(columns) : undefinedFallback
        }
        nullFallback={typeof nullFallback === "function" ? nullFallback(columns) : nullFallback}
      />
    );
  }

  return (
    <>
      {boundaryNullable}
      {boundaryData}
    </>
  );
}

export default QueryBoundaryDataRowsMap;
