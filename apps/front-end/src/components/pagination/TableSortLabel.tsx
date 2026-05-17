import type { TableSortLabelOwnProps } from "@mui/material/TableSortLabel";

import MUITableSortLabel from "@mui/material/TableSortLabel";

import { usePaginationContext } from "src/components/pagination/PaginationProvider";

export interface TableSortLabelProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<TableSortLabelOwnProps, "active" | "direction" | "onClick"> {
  columnName: keyof DataType;
}

function TableSortLabel<DataType extends object = Record<PropertyKey, unknown>>({
  columnName,
  children,
  ...props
}: TableSortLabelProps<DataType>) {
  const { pagination } = usePaginationContext<DataType>();
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
