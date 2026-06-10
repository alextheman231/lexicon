import type { TableSortLabelOwnProps } from "@mui/material/TableSortLabel";

import type usePagination from "src/hooks/usePagination";

import MUITableSortLabel from "@mui/material/TableSortLabel";

export interface TableSortLabelProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<TableSortLabelOwnProps, "active" | "direction" | "onClick"> {
  columnName: keyof DataType;
  pagination: ReturnType<typeof usePagination<DataType>>;
}

function TableSortLabel<DataType extends object = Record<PropertyKey, unknown>>({
  columnName,
  children,
  pagination,
  ...props
}: TableSortLabelProps<DataType>) {
  const {
    state: { paginationSettings },
    actions: { applySort },
  } = pagination;

  return (
    <MUITableSortLabel
      {...props}
      active={paginationSettings.sortColumn === columnName}
      direction={paginationSettings.sortDirection}
      onClick={() => {
        applySort(columnName);
      }}
    >
      {children}
    </MUITableSortLabel>
  );
}

export default TableSortLabel;
