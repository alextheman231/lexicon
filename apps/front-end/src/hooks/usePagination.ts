import type { SortDirection } from "@alextheman/utility";

import { useDebounce } from "@alextheman/components";
import { omitProperties } from "@alextheman/utility";
import { useCallback, useMemo, useReducer } from "react";

interface PaginationState<DataType extends object = Record<PropertyKey, unknown>> {
  pageNumber: number;
  pageSize: number;
  rawSearch: string;
  sortColumn?: keyof DataType;
  sortDirection: SortDirection;
}

export interface PaginationSettings<DataType extends object = Record<PropertyKey, unknown>> {
  pageNumber: number;
  pageSize: number;
  searchQuery?: string;
  sortColumn?: keyof DataType;
  sortDirection: SortDirection;
}

export interface PaginatedResult<DataType> {
  rows: Array<DataType>;
  totalRecordCount: number;
}

interface SortAction<DataType extends object = Record<PropertyKey, unknown>> {
  type: "applySort";
  value: {
    sortColumn: keyof DataType;
    sortDirection?: SortDirection;
  };
}

interface PageAction {
  type: "setPageNumber" | "setPageSize";
  value: number;
}

interface SearchAction {
  type: "setRawSearch";
  value: string;
}

type Action<DataType extends object = Record<PropertyKey, unknown>> =
  SortAction<DataType> | PageAction | SearchAction;

function createReducer<DataType extends object = Record<PropertyKey, unknown>>(
  initialState: Partial<PaginationSettings<DataType>>,
) {
  return (
    state: PaginationState<DataType>,
    action: Action<DataType>,
  ): PaginationState<DataType> => {
    switch (action.type) {
      case "applySort": {
        if (state.sortColumn === action.value.sortColumn) {
          return {
            ...state,
            sortDirection:
              action.value.sortDirection ?? (state.sortDirection === "asc" ? "desc" : "asc"),
          };
        }
        return {
          ...state,
          sortColumn: action.value.sortColumn,
          sortDirection: action.value.sortDirection ?? "asc",
        };
      }
      case "setPageNumber": {
        return {
          ...state,
          pageNumber: action.value,
        };
      }
      case "setPageSize": {
        return {
          ...state,
          pageSize: action.value,
        };
      }
      case "setRawSearch": {
        if (state.rawSearch === "") {
          return {
            ...omitProperties(state, "sortColumn"),
            pageNumber: 0,
            rawSearch: action.value,
          };
        } else if (action.value === "") {
          return {
            ...state,
            pageNumber: 0,
            rawSearch: "",
            sortColumn: initialState.sortColumn,
            sortDirection: initialState.sortDirection ?? "asc",
          };
        }
        return { ...state, rawSearch: action.value };
      }
      default: {
        return state;
      }
    }
  };
}

function usePagination<DataType extends object = Record<PropertyKey, unknown>>(
  initialState: Partial<PaginationSettings<DataType>>,
) {
  const rawSearch = initialState.searchQuery ?? "";
  const sortColumn = rawSearch === "" ? (initialState.sortColumn ?? undefined) : undefined;
  const [internalState, dispatch] = useReducer<
    PaginationState<DataType>,
    [action: Action<DataType>]
  >(createReducer(initialState), {
    pageNumber: initialState.pageNumber ?? 0,
    pageSize: initialState.pageSize ?? 100,
    rawSearch,
    sortColumn,
    sortDirection: initialState.sortDirection ?? "asc",
  });

  const searchQuery = useDebounce<string | undefined>(
    internalState.rawSearch !== "" ? internalState.rawSearch : undefined,
  );

  const state = useMemo<PaginationSettings<DataType>>(() => {
    return {
      pageNumber: internalState.pageNumber,
      pageSize: internalState.pageSize,
      searchQuery,
      sortColumn: internalState.sortColumn,
      sortDirection: internalState.sortDirection,
    };
  }, [internalState, searchQuery]);

  const applySort = useCallback(
    (sortColumn: keyof DataType, sortDirection?: SortDirection) => {
      dispatch({ type: "applySort", value: { sortColumn, sortDirection } });
    },
    [dispatch],
  );
  const setPageNumber = useCallback(
    (pageNumber: number) => {
      dispatch({ type: "setPageNumber", value: pageNumber });
    },
    [dispatch],
  );
  const setPageSize = useCallback(
    (pageSize: number) => {
      dispatch({ type: "setPageSize", value: pageSize });
    },
    [dispatch],
  );
  const setRawSearch = useCallback(
    (rawSearch: string) => {
      dispatch({ type: "setRawSearch", value: rawSearch });
    },
    [dispatch],
  );

  return {
    state: { paginationSettings: state, rawSearch: internalState.rawSearch },
    actions: { applySort, setPageNumber, setPageSize, setRawSearch },
  } as const;
}

export default usePagination;
