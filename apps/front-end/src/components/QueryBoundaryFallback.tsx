import type { QueryBoundaryErrorProps, QueryBoundaryNullableProps } from "@alextheman/components";
import type { ReactNode } from "react";

import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import { QueryBoundaryNullable } from "@alextheman/components";

import QueryBoundaryError from "src/components/QueryBoundaryError";

export type QueryBoundaryFallbackErrorPropsBase = Omit<QueryBoundaryErrorProps, "children">;

export interface QueryBoundaryFallbackErrorPropsCodeError extends QueryBoundaryFallbackErrorPropsBase {
  errorComponent?: never;
  codeErrorMap?: CodeErrorMap;
  errorFunction?: (error: unknown) => string;
}

export interface QueryBoundaryFallbackErrorPropsDefault extends QueryBoundaryFallbackErrorPropsBase {
  errorComponent: ReactNode | ((error: unknown) => ReactNode);
  codeErrorMap?: never;
  errorFunction?: never;
}

export type QueryBoundaryFallbackErrorProps =
  | QueryBoundaryFallbackErrorPropsDefault
  | QueryBoundaryFallbackErrorPropsCodeError;

export type QueryBoundaryFallbackProps = QueryBoundaryFallbackErrorProps &
  QueryBoundaryNullableProps;

function QueryBoundaryFallback({
  errorComponent,
  codeErrorMap,
  errorFunction,
  logError,
  ...queryBoundaryNullableProps
}: QueryBoundaryFallbackProps) {
  let queryBoundaryError = <QueryBoundaryError logError={logError} />;

  if (errorComponent) {
    queryBoundaryError = (
      <QueryBoundaryError logError={logError}>{errorComponent}</QueryBoundaryError>
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
