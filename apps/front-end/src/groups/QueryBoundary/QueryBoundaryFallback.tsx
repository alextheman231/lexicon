import type {
  QueryBoundaryErrorProps,
  QueryBoundaryNullableProps,
} from "@alextheman/components/QueryBoundary";
import type { ReactNode } from "react";

import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import { QueryBoundaryNullable } from "@alextheman/components/QueryBoundary";

import QueryBoundaryError from "src/groups/QueryBoundary/QueryBoundaryError";

export type QueryBoundaryFallbackErrorPropsBase = Omit<QueryBoundaryErrorProps, "children">;

export interface QueryBoundaryFallbackErrorPropsCodeError extends QueryBoundaryFallbackErrorPropsBase {
  errorFallback?: never;
  codeErrorMap?: CodeErrorMap;
  errorFunction?: (error: unknown) => string;
}

export interface QueryBoundaryFallbackErrorPropsDefault extends QueryBoundaryFallbackErrorPropsBase {
  errorFallback: ReactNode | ((error: unknown) => ReactNode);
  codeErrorMap?: never;
  errorFunction?: never;
}

export type QueryBoundaryFallbackErrorProps =
  | QueryBoundaryFallbackErrorPropsDefault
  | QueryBoundaryFallbackErrorPropsCodeError;

export type QueryBoundaryFallbackProps = QueryBoundaryFallbackErrorProps &
  QueryBoundaryNullableProps;

function QueryBoundaryFallback({
  errorFallback,
  codeErrorMap,
  errorFunction,
  logError,
  ...queryBoundaryNullableProps
}: QueryBoundaryFallbackProps) {
  let queryBoundaryError = <QueryBoundaryError logError={logError} />;

  if (errorFallback) {
    queryBoundaryError = (
      <QueryBoundaryError logError={logError}>{errorFallback}</QueryBoundaryError>
    );
  }

  if (codeErrorMap || errorFunction) {
    queryBoundaryError = (
      <QueryBoundaryError
        logError={logError}
        codeErrorMap={codeErrorMap}
        errorFunction={errorFunction}
      />
    );
  }

  return (
    <>
      {queryBoundaryError}
      <QueryBoundaryNullable {...queryBoundaryNullableProps} />
    </>
  );
}

export default QueryBoundaryFallback;
