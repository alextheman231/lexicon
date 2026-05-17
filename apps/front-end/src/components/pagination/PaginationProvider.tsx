import type { ContextHookOptions } from "@alextheman/components";
import type { OptionalOnCondition } from "@alextheman/utility";
import type { ReactNode } from "react";

import type usePagination from "src/hooks/usePagination";

import { DataError } from "@alextheman/utility/v6";
import { createContext, useContext } from "react";

export interface PaginationContextValue<DataType extends object = Record<PropertyKey, unknown>> {
  pagination: ReturnType<typeof usePagination<DataType>>;
}

export interface PaginationProviderProps<
  DataType extends object = Record<PropertyKey, unknown>,
> extends PaginationContextValue<DataType> {
  children: ReactNode;
}

const PaginationContext = createContext<PaginationContextValue<any> | undefined>(undefined);

export function usePaginationContext<
  DataType extends object = Record<PropertyKey, unknown>,
  Strict extends boolean = true,
>({ strict = true as Strict }: ContextHookOptions<Strict> = {}): OptionalOnCondition<
  Strict,
  PaginationContextValue<DataType>
> {
  const context = useContext(PaginationContext);

  if (strict && !context) {
    throw new DataError(
      { strict, context },
      "PAGINATION_PROVIDER_NOT_FOUND",
      "Could not find the PaginationProvider. Please double-check that it is present.",
    );
  }

  return context as OptionalOnCondition<Strict, PaginationContextValue<DataType>>;
}

function PaginationProvider<DataType extends object = Record<PropertyKey, unknown>>({
  pagination,
  children,
}: PaginationProviderProps<DataType>) {
  const value: PaginationContextValue<DataType> = { pagination };

  return <PaginationContext.Provider value={value}>{children}</PaginationContext.Provider>;
}

export default PaginationProvider;
