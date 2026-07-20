import type {
  CreateBaseQueryBoundaryParameters,
  DefaultQueryBoundaryComponentsBase,
} from "@alextheman/components/QueryBoundary";
import type { JSX } from "react";

import type { QueryBoundaryErrorProps } from "src/groups/QueryBoundary/QueryBoundaryError";

import { createBaseQueryBoundary as createAlexBaseQueryBoundary } from "@alextheman/components/QueryBoundary";

import QueryBoundaryError from "src/groups/QueryBoundary/QueryBoundaryError";

export interface LexiconQueryBoundaryComponentsBase extends Omit<
  DefaultQueryBoundaryComponentsBase,
  "Error" | "Fallback"
> {
  Error: (props: Omit<QueryBoundaryErrorProps, "data" | "isLoading" | "error">) => JSX.Element;
}

function createBaseQueryBoundary<DataType>(
  params: CreateBaseQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponentsBase {
  const baseComponents = createAlexBaseQueryBoundary(params);

  return {
    ...baseComponents,
    Error: ({ children, codeErrorMap, errorFunction, ...props }) => {
      if (children !== undefined) {
        return (
          <QueryBoundaryError {...params.query} {...props}>
            {children}
          </QueryBoundaryError>
        );
      }
      if (codeErrorMap !== undefined || errorFunction !== undefined) {
        return (
          <QueryBoundaryError
            {...params.query}
            {...props}
            codeErrorMap={codeErrorMap}
            errorFunction={errorFunction}
          />
        );
      }
      return <QueryBoundaryError {...params.query} {...props} />;
    },
  };
}

export default createBaseQueryBoundary;
