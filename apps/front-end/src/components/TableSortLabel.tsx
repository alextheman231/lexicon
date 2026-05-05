import type { TableSortLabelOwnProps } from "@mui/material/TableSortLabel";

import type { PaginationSettings } from "src/hooks/usePagination";

import MUITableSortLabel from "@mui/material/TableSortLabel";

export interface TableSortLabelProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<TableSortLabelOwnProps, "active" | "direction" | "onClick"> {
  applySort: (sortColumn: keyof DataType) => void;
  columnName: keyof DataType;
  paginationSettings: PaginationSettings<DataType>;
}

function TableSortLabel<DataType extends object = Record<PropertyKey, unknown>>({
  applySort,
  columnName,
  paginationSettings,
  children,
  ...props
}: TableSortLabelProps<DataType>) {
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
