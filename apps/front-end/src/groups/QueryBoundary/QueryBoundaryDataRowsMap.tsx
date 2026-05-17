import type { QueryBoundaryDataMapProps } from "@alextheman/components";
import type { ReactNode } from "react";

import { QueryBoundaryNullable, SkeletonRow } from "@alextheman/components";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import QueryBoundaryDataMap from "src/groups/QueryBoundary/QueryBoundaryDataMap";

type FallbackComponent = ReactNode | ((columns: number) => ReactNode);

export interface QueryBoundaryDataRowsMapBaseProps {
  columns: number;
  emptyComponent?: FallbackComponent;
  loadingComponent?: ReactNode | ((columns: number) => ReactNode);
}
export interface QueryBoundaryDataRowsPropsNullable extends QueryBoundaryDataRowsMapBaseProps {
  nullableComponent?: FallbackComponent;
  undefinedComponent?: never;
  nullComponent?: never;
}

export interface QueryBoundaryDataRowsPropsUndefinedOrNull extends QueryBoundaryDataRowsMapBaseProps {
  nullableComponent?: never;
  undefinedComponent?: FallbackComponent;
  nullComponent?: FallbackComponent;
}

export type QueryBoundaryDataRowsMapProps<ItemType> = Omit<
  QueryBoundaryDataMapProps<ItemType>,
  "emptyComponent" | "loadingComponent"
> &
  (QueryBoundaryDataRowsPropsNullable | QueryBoundaryDataRowsPropsUndefinedOrNull);

function QueryBoundaryDataRowsMap<ItemType>({
  columns,
  loadingComponent = (columns) => {
    return <SkeletonRow columns={columns} />;
  },
  emptyComponent = (columns) => {
    return (
      <TableRow>
        <TableCell colSpan={columns}>No data found.</TableCell>
      </TableRow>
    );
  },
  undefinedComponent,
  nullComponent,
  nullableComponent = (columns) => {
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
  const resolvedLoadingComponent =
    typeof loadingComponent === "function" ? loadingComponent(columns) : loadingComponent;
  const resolvedEmptyComponent =
    typeof emptyComponent === "function" ? emptyComponent(columns) : emptyComponent;

  let boundaryData = (
    <QueryBoundaryDataMap
      emptyComponent={resolvedEmptyComponent}
      loadingComponent={resolvedLoadingComponent}
      {...props}
    >
      {children}
    </QueryBoundaryDataMap>
  );

  if (dataParser) {
    boundaryData = (
      <QueryBoundaryDataMap
        emptyComponent={resolvedEmptyComponent}
        loadingComponent={resolvedLoadingComponent}
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
        emptyComponent={resolvedEmptyComponent}
        loadingComponent={resolvedLoadingComponent}
        itemParser={itemParser}
        {...props}
      >
        {children}
      </QueryBoundaryDataMap>
    );
  }

  let boundaryNullable = <QueryBoundaryNullable />;

  if (nullableComponent) {
    boundaryNullable = (
      <QueryBoundaryNullable
        nullableComponent={
          typeof nullableComponent === "function" ? nullableComponent(columns) : nullableComponent
        }
      />
    );
  }

  if (undefinedComponent || nullComponent) {
    boundaryNullable = (
      <QueryBoundaryNullable
        undefinedComponent={
          typeof undefinedComponent === "function"
            ? undefinedComponent(columns)
            : undefinedComponent
        }
        nullComponent={typeof nullComponent === "function" ? nullComponent(columns) : nullComponent}
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
