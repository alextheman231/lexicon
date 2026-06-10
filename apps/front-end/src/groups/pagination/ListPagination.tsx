import type { PaginationProps } from "@mui/material/Pagination";

import type usePagination from "src/hooks/usePagination";

import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

export interface ListPaginationProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<PaginationProps, "count" | "page"> {
  totalRecordCount?: number;
  pagination: ReturnType<typeof usePagination<DataType>>;
}

function ListPagination<DataType extends object = Record<PropertyKey, unknown>>({
  totalRecordCount,
  onChange,
  pagination,
  ...paginationProps
}: ListPaginationProps<DataType>) {
  const {
    state: { paginationSettings },
    actions: { setPageNumber },
  } = pagination;

  return (
    <>
      <Pagination
        count={paginationSettings.pageSize}
        page={paginationSettings.pageNumber}
        onChange={(event, value) => {
          if (onChange) {
            onChange(event, value);
          }
          if (event.defaultPrevented) {
            return;
          }
          setPageNumber(value);
        }}
        {...paginationProps}
      />
      <Typography variant="subtitle2">Total: {totalRecordCount ?? 0}</Typography>
    </>
  );
}

export default ListPagination;
