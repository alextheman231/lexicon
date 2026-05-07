import type { TablePaginationOwnProps } from "@mui/material/TablePagination";
import type { ChangeEvent, MouseEvent } from "react";

import type { PaginationSettings } from "src/hooks/usePagination";

import { assertNotUndefined, parseIntStrict } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import MUITablePagination from "@mui/material/TablePagination";

import { usePaginationContext } from "src/components/PaginationProvider";

export interface TablePaginationProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<
  TablePaginationOwnProps,
  "count" | "onPageChange" | "onRowsPerPageChange" | "page" | "rowsPerPage"
> {
  paginationSettings?: PaginationSettings<DataType>;
  recordCount?: number;
  setPageNumber?: (pageNumber: number) => void;
  setPageSize?: (pageSize: number) => void;
}

function TablePagination<DataType extends object = Record<PropertyKey, unknown>>({
  recordCount,
  rowsPerPageOptions = [100, 500, 750, 1000],
  ...props
}: TablePaginationProps<DataType>) {
  const { pagination } = usePaginationContext<DataType, false>({ strict: false }) ?? {};

  const paginationSettings = props.paginationSettings ?? pagination?.state.paginationSettings;
  const setPageNumber = props.setPageNumber ?? pagination?.actions.setPageNumber;
  const setPageSize = props.setPageSize ?? pagination?.actions.setPageSize;

  if (!paginationSettings || !setPageNumber || !setPageSize) {
    throw new DataError(
      { paginationSettings, setPageNumber, setPageSize },
      "PAGINATION_DATA_NOT_FOUND",
      "Could not retrieve pagination data from either props or context.",
    );
  }

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
