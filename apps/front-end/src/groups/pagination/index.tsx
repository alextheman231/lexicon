import type { SearchProps } from "@alextheman/components";
import type { JSX } from "react";

import type { ListPaginationProps } from "src/groups/pagination/ListPagination";
import type { TablePaginationProps } from "src/groups/pagination/TablePagination";
import type { TableSortLabelProps } from "src/groups/pagination/TableSortLabel";
import type usePagination from "src/hooks/usePagination";

import { Search } from "@alextheman/components";

import ListPagination from "src/groups/pagination/ListPagination";
import TablePagination from "src/groups/pagination/TablePagination";
import TableSortLabel from "src/groups/pagination/TableSortLabel";

export interface PaginationComponents<DataType extends object = Record<PropertyKey, unknown>> {
  TablePagination: (props: Omit<TablePaginationProps<DataType>, "pagination">) => JSX.Element;
  TableSortLabel: (props: Omit<TableSortLabelProps<DataType>, "pagination">) => JSX.Element;
  ListPagination: (props: Omit<ListPaginationProps<DataType>, "pagination">) => JSX.Element;
  Search: (props: Omit<SearchProps, "rawSearch" | "setRawSearch">) => JSX.Element;
}

function createPaginationGroup<DataType extends object = Record<PropertyKey, unknown>>(
  pagination: ReturnType<typeof usePagination<DataType>>,
): PaginationComponents<DataType> {
  return {
    TablePagination: (props) => {
      return <TablePagination pagination={pagination} {...props} />;
    },
    TableSortLabel: (props) => {
      return <TableSortLabel pagination={pagination} {...props} />;
    },
    ListPagination: (props) => {
      return <ListPagination pagination={pagination} {...props} />;
    },
    Search: (props) => {
      return (
        <Search
          rawSearch={pagination.state.rawSearch}
          setRawSearch={pagination.actions.setRawSearch}
          {...props}
        />
      );
    },
  };
}

export default createPaginationGroup;
