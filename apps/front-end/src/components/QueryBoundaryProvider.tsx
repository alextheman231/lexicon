import type {
  QueryBoundaryProviderPropsWithError as AlexQueryBoundaryProviderPropsWithError,
  QueryBoundaryProviderPropsWithNoError as AlexQueryBoundaryProviderPropsWithNoError,
} from "@alextheman/components";
import type { ReactNode } from "react";

import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import { QueryBoundaryProvider as AlexQueryBoundaryProvider } from "@alextheman/components";

import ErrorMessage from "src/components/ErrorMessage";

export interface QueryBoundaryProviderPropsWithError<
  DataType,
> extends AlexQueryBoundaryProviderPropsWithError<DataType> {
  codeErrorMap?: never;
  errorFunction?: never;
}

export interface QueryBoundaryProviderPropsWithNoError<
  DataType,
> extends AlexQueryBoundaryProviderPropsWithNoError<DataType> {
  codeErrorMap?: never;
  errorFunction?: never;
}

export interface QueryBoundaryProviderPropsWithCodeError<DataType> extends Omit<
  AlexQueryBoundaryProviderPropsWithError<DataType>,
  "errorComponent"
> {
  errorComponent?: never;
  codeErrorMap?: CodeErrorMap;
  errorFunction?: (error: unknown) => string;
}

export type QueryBoundaryProviderProps<DataType> = (
  | QueryBoundaryProviderPropsWithError<DataType>
  | QueryBoundaryProviderPropsWithCodeError<DataType>
  | QueryBoundaryProviderPropsWithNoError<DataType>
) & {
  children: ReactNode;
};

function QueryBoundaryProvider<DataType>({
  codeErrorMap,
  errorFunction,
  children,
  ...queryBoundaryProviderProps
}: QueryBoundaryProviderProps<DataType>) {
  return (
    <AlexQueryBoundaryProvider
      logError={import.meta.env.DEV}
      errorComponent={(error) => {
        return (
          <ErrorMessage error={error} codeErrorMap={codeErrorMap} errorFunction={errorFunction} />
        );
      }}
      {...queryBoundaryProviderProps}
    >
      {children}
    </AlexQueryBoundaryProvider>
  );
}

export default QueryBoundaryProvider;
