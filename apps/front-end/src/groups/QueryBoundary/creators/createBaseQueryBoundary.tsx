import type {
  CreateBaseQueryBoundaryParameters,
  DefaultQueryBoundaryComponentsBase,
} from "@alextheman/components/QueryBoundary";

import { createBaseQueryBoundary as createAlexBaseQueryBoundary } from "@alextheman/components/QueryBoundary";

import QueryBoundaryError from "src/groups/QueryBoundary/QueryBoundaryError";
import QueryBoundaryFallback from "src/groups/QueryBoundary/QueryBoundaryFallback";

export interface LexiconQueryBoundaryComponentsBase extends Omit<
  DefaultQueryBoundaryComponentsBase,
  "Error" | "Fallback"
> {
  Error: typeof QueryBoundaryError;
  Fallback: typeof QueryBoundaryFallback;
}

function createBaseQueryBoundary<DataType>(
  params: CreateBaseQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponentsBase {
  const baseComponents = createAlexBaseQueryBoundary(params);

  return {
    ...baseComponents,
    Error: QueryBoundaryError,
    Fallback: QueryBoundaryFallback,
  };
}

export default createBaseQueryBoundary;
