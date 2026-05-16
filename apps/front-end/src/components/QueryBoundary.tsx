import type { QueryBoundaryDataProps, QueryBoundaryFallbackProps } from "@alextheman/components";

import type { QueryBoundaryProviderProps } from "src/components/QueryBoundaryProvider";

import { QueryBoundaryWrapper as AlexQueryBoundaryWrapper } from "@alextheman/components";

import ErrorMessage from "src/components/ErrorMessage";

export type QueryBoundaryProps<DataType> = Omit<
  QueryBoundaryProviderProps<DataType>,
  "children" | "logError"
> &
  Omit<QueryBoundaryFallbackProps, "errorComponent"> &
  Omit<QueryBoundaryDataProps<DataType>, "showOnError">;

function QueryBoundaryWrapper<DataType>({
  children,
  codeErrorMap,
  errorFunction,
  ...queryBoundaryProps
}: QueryBoundaryProps<DataType>) {
  return (
    <AlexQueryBoundaryWrapper
      logError={import.meta.env.DEV}
      errorComponent={(error) => {
        return (
          <ErrorMessage error={error} codeErrorMap={codeErrorMap} errorFunction={errorFunction} />
        );
      }}
      {...queryBoundaryProps}
    >
      {children}
    </AlexQueryBoundaryWrapper>
  );
}

export default QueryBoundaryWrapper;
