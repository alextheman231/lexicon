import type { TableSortLabelOwnProps } from "@mui/material/TableSortLabel";

import type { PaginationSettings } from "src/hooks/usePagination";

import { DataError } from "@alextheman/utility/v6";
import MUITableSortLabel from "@mui/material/TableSortLabel";

import { usePaginationContext } from "src/components/PaginationProvider";

export interface TableSortLabelProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends Omit<TableSortLabelOwnProps, "active" | "direction" | "onClick"> {
  applySort?: (sortColumn: keyof DataType) => void;
  columnName: keyof DataType;
  paginationSettings?: PaginationSettings<DataType>;
}

function TableSortLabel<DataType extends object = Record<PropertyKey, unknown>>({
  columnName,
  children,
  ...props
}: TableSortLabelProps<DataType>) {
  const { pagination } = usePaginationContext<DataType, false>({ strict: false }) ?? {};

  const applySort = props.applySort ?? pagination?.actions.applySort;
  const paginationSettings = props.paginationSettings ?? pagination?.state.paginationSettings;

  if (!applySort || !paginationSettings) {
    throw new DataError(
      { applySort, paginationSettings },
      "PAGINATION_DATA_NOT_FOUND",
      "Could not retrieve pagination data from either props or context.",
    );
  }

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
