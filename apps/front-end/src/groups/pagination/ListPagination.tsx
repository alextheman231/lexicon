import type { PaginationProps } from "@mui/material/Pagination";

import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

import { usePaginationContext } from "src/groups/pagination/PaginationProvider";

export interface ListPaginationProps extends Omit<PaginationProps, "count" | "page"> {
  totalRecordCount?: number;
}

function ListPagination({ totalRecordCount, onChange, ...paginationProps }: ListPaginationProps) {
  const { pagination } = usePaginationContext();
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
