import type { QueryBoundaryErrorProps as AlexQueryBoundaryErrorProps } from "@alextheman/components/QueryBoundary";
import type { ReactNode } from "react";

import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import { QueryBoundaryError as AlexQueryBoundaryError } from "@alextheman/components/QueryBoundary";

import ErrorMessage from "src/components/ErrorMessage";

export type QueryBoundaryErrorPropsBase = Omit<AlexQueryBoundaryErrorProps, "children">;

export interface QueryBoundaryErrorPropsCodeError extends QueryBoundaryErrorPropsBase {
  children?: never;
  codeErrorMap?: CodeErrorMap;
  errorFunction?: (error: unknown) => string;
}

export interface QueryBoundaryErrorPropsDefault extends QueryBoundaryErrorPropsBase {
  children: ReactNode | ((error: unknown) => ReactNode);
  codeErrorMap?: never;
  errorFunction?: never;
}

export type QueryBoundaryErrorProps =
  | QueryBoundaryErrorPropsDefault
  | QueryBoundaryErrorPropsCodeError;

function QueryBoundaryError({
  children,
  codeErrorMap,
  errorFunction,
  ...queryBoundaryErrorProps
}: QueryBoundaryErrorProps) {
  return (
    <AlexQueryBoundaryError {...queryBoundaryErrorProps}>
      {children ??
        ((error) => {
          return (
            <ErrorMessage error={error} codeErrorMap={codeErrorMap} errorFunction={errorFunction} />
          );
        })}
    </AlexQueryBoundaryError>
  );
}

export default QueryBoundaryError;
