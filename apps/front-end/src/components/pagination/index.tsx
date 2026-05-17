import type { JSX, ReactNode } from "react";

import type usePagination from "src/hooks/usePagination";

import PaginationProvider from "src/components/pagination/PaginationProvider";
import TablePagination from "src/components/pagination/TablePagination";
import TableSortLabel from "src/components/pagination/TableSortLabel";

export interface PaginationComponents<DataType extends object = Record<PropertyKey, unknown>> {
  Context: (props: { children: ReactNode }) => JSX.Element;
  TablePagination: typeof TablePagination;
  TableSortLabel: typeof TableSortLabel<DataType>;
}

function createPaginationGroup<DataType extends object = Record<PropertyKey, unknown>>(
  pagination: ReturnType<typeof usePagination<DataType>>,
): PaginationComponents<DataType> {
  return {
    Context: ({ children }) => {
      return <PaginationProvider pagination={pagination}>{children}</PaginationProvider>;
    },
    TablePagination,
    TableSortLabel,
  };
}

export default createPaginationGroup;
