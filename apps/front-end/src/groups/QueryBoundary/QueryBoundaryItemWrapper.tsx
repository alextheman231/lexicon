import type { QueryBoundaryDataProps } from "@alextheman/components/QueryBoundary";
import type { ReactNode } from "react";

import type { QueryBoundaryErrorProps } from "src/groups/QueryBoundary/QueryBoundaryError";

import { QueryBoundaryItemWrapper as AlexQueryBoundaryItemWrapper } from "@alextheman/components/QueryBoundary";
import Skeleton from "@mui/material/Skeleton";

import ErrorMessage from "src/components/ErrorMessage";

export type QueryBoundaryItemWrapperProps<DataType> = Omit<QueryBoundaryErrorProps, "children"> & {
  errorFallback?: ReactNode | ((error: unknown) => ReactNode);
} & QueryBoundaryDataProps<DataType>;

function QueryBoundaryItemWrapper<DataType>({
  children,
  codeErrorMap,
  errorFunction,
  ...queryBoundaryProps
}: QueryBoundaryItemWrapperProps<DataType>) {
  return (
    <AlexQueryBoundaryItemWrapper
      logError={import.meta.env.DEV}
      loadingFallback={<Skeleton />}
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
