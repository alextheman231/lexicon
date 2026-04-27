import type { QueryBoundaryDataProps, QueryBoundaryErrorProps } from "@alextheman/components";

import type { QueryBoundaryProviderProps } from "src/components/QueryBoundaryProvider";

import { QueryBoundary as AlexQueryBoundary } from "@alextheman/components";

import ErrorMessage from "src/components/ErrorMessage";

export type QueryBoundaryProps<DataType> = Omit<
  QueryBoundaryProviderProps<DataType>,
  "children" | "logError"
> &
  Omit<QueryBoundaryErrorProps, "children"> &
  Omit<QueryBoundaryDataProps<DataType>, "showOnError">;

function QueryBoundary<DataType>({
  children,
  codeErrorMap,
  errorFunction,
  ...queryBoundaryProps
}: QueryBoundaryProps<DataType>) {
  return (
    <AlexQueryBoundary
      logError={import.meta.env.DEV}
      errorComponent={(error) => {
        return (
          <ErrorMessage error={error} codeErrorMap={codeErrorMap} errorFunction={errorFunction} />
        );
      }}
      {...queryBoundaryProps}
    >
      {children}
    </AlexQueryBoundary>
  );
}

export default QueryBoundary;
