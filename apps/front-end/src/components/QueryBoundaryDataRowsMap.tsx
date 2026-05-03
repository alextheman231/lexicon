import type { QueryBoundaryDataMapProps } from "@alextheman/components";
import type { ReactNode } from "react";

import { QueryBoundaryDataMap, SkeletonRow } from "@alextheman/components";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export type QueryBoundaryDataRowsMap<ItemType> = Omit<
  QueryBoundaryDataMapProps<ItemType>,
  "emptyComponent" | "loadingComponent"
> & {
  columns: number;
  emptyComponent?: ReactNode | ((columns: number) => ReactNode);
  loadingComponent?: ReactNode | ((columns: number) => ReactNode);
};

function QueryBoundaryDataRowsMap<ItemType>({
  columns,
  loadingComponent = (columns) => {
    return <SkeletonRow columns={columns} />;
  },
  emptyComponent = (columns) => {
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
}: QueryBoundaryDataRowsMap<ItemType>) {
  const resolvedLoadingComponent =
    typeof loadingComponent === "function" ? loadingComponent(columns) : loadingComponent;
  const resolvedEmptyComponent =
    typeof emptyComponent === "function" ? emptyComponent(columns) : emptyComponent;

  if (dataParser) {
    return (
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
    return (
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

  return (
    <QueryBoundaryDataMap
      emptyComponent={resolvedEmptyComponent}
      loadingComponent={resolvedLoadingComponent}
      {...props}
    >
      {children}
    </QueryBoundaryDataMap>
  );
}

export default QueryBoundaryDataRowsMap;
