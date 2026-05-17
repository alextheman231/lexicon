import type { TablePaginationOwnProps } from "@mui/material/TablePagination";
import type { ChangeEvent, MouseEvent } from "react";

import { assertNotUndefined, parseIntStrict } from "@alextheman/utility";
import MUITablePagination from "@mui/material/TablePagination";

import { usePaginationContext } from "src/groups/pagination/PaginationProvider";

export interface TablePaginationProps extends Omit<
  TablePaginationOwnProps,
  "count" | "onPageChange" | "onRowsPerPageChange" | "page" | "rowsPerPage"
> {
  recordCount?: number;
}

function TablePagination<DataType extends object = Record<PropertyKey, unknown>>({
  recordCount,
  rowsPerPageOptions = [100, 500, 750, 1000],
  ...props
}: TablePaginationProps) {
  const { pagination } = usePaginationContext<DataType>();
  const {
    state: { paginationSettings },
    actions: { setPageNumber, setPageSize },
  } = pagination;

  function handlePageChange(_event: MouseEvent<HTMLButtonElement> | null, newPage: number) {
    assertNotUndefined(setPageNumber);
    setPageNumber(newPage);
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    assertNotUndefined(setPageSize);
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
