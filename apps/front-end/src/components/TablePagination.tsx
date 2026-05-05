import type { TablePaginationOwnProps } from "@mui/material/TablePagination";
import type { ChangeEvent, MouseEvent } from "react";

import type { PaginationSettings } from "src/hooks/usePagination";

import { parseIntStrict } from "@alextheman/utility";
import MUITablePagination from "@mui/material/TablePagination";

export interface TablePaginationProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<
  TablePaginationOwnProps,
  "count" | "onPageChange" | "onRowsPerPageChange" | "page" | "rowsPerPage"
> {
  paginationSettings: PaginationSettings<DataType>;
  recordCount?: number;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
}

function TablePagination<DataType extends object = Record<PropertyKey, unknown>>({
  paginationSettings,
  recordCount,
  setPageNumber,
  setPageSize,
  rowsPerPageOptions = [100, 500, 750, 1000],
  ...props
}: TablePaginationProps<DataType>) {
  function handlePageChange(_event: MouseEvent<HTMLButtonElement> | null, newPage: number) {
    setPageNumber(newPage);
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPageSize(parseIntStrict(event.target.value));
  }

  return (
    <MUITablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      {...props}
      count={recordCount ?? 0}
      page={paginationSettings.pageNumber}
      rowsPerPage={paginationSettings.pageSize ?? recordCount ?? 0}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
}

export default TablePagination;
