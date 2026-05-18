import type { JSX, ReactNode } from "react";

import type usePagination from "src/hooks/usePagination";

import ListPagination from "src/groups/pagination/ListPagination";
import PaginationProvider from "src/groups/pagination/PaginationProvider";
import TablePagination from "src/groups/pagination/TablePagination";
import TableSortLabel from "src/groups/pagination/TableSortLabel";

export interface PaginationComponents<DataType extends object = Record<PropertyKey, unknown>> {
  Context: (props: { children: ReactNode }) => JSX.Element;
  TablePagination: typeof TablePagination;
  TableSortLabel: typeof TableSortLabel<DataType>;
  ListPagination: typeof ListPagination;
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
    ListPagination,
  };
}

export default createPaginationGroup;
