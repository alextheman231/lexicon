import type {
  QueryBoundaryContextValue,
  QueryBoundaryDataProps,
} from "@alextheman/components/QueryBoundary";

import type { QueryBoundaryFallbackProps } from "src/groups/QueryBoundary/QueryBoundaryFallback";

import { QueryBoundaryItemWrapper as AlexQueryBoundaryItemWrapper } from "@alextheman/components/QueryBoundary";

import ErrorMessage from "src/components/ErrorMessage";

export type QueryBoundaryItemWrapperProps<DataType> = QueryBoundaryContextValue<DataType> &
  QueryBoundaryFallbackProps &
  QueryBoundaryDataProps<DataType>;

function QueryBoundaryItemWrapper<DataType>({
  children,
  codeErrorMap,
  errorFunction,
  ...queryBoundaryProps
}: QueryBoundaryItemWrapperProps<DataType>) {
  return (
    <AlexQueryBoundaryItemWrapper
      logError={import.meta.env.DEV}
      errorFallback={(error) => {
        return (
          <ErrorMessage error={error} codeErrorMap={codeErrorMap} errorFunction={errorFunction} />
        );
      }}
      {...queryBoundaryProps}
    >
      {children}
    </AlexQueryBoundaryItemWrapper>
  );
}

export default QueryBoundaryItemWrapper;
