import type {
  CreateItemQueryBoundaryParameters,
  QueryBoundaryDataProps,
} from "@alextheman/components/QueryBoundary";
import type { JSX } from "react";

import type { LexiconQueryBoundaryComponentsBase } from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

import { createItemQueryBoundary as createAlexItemQueryBoundary } from "@alextheman/components/QueryBoundary";

import createBaseQueryBoundary from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

export interface LexiconQueryBoundaryComponentsItem<
  DataType,
> extends LexiconQueryBoundaryComponentsBase {
  Data: (
    props: Omit<QueryBoundaryDataProps<DataType>, "data" | "isLoading" | "error">,
  ) => JSX.Element;
}

function createItemQueryBoundary<DataType>(
  params: CreateItemQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponentsItem<DataType> {
  const baseComponents = createBaseQueryBoundary(params);
  const { Data } = createAlexItemQueryBoundary(params);

  return {
    ...baseComponents,
    Data,
  };
}

export default createItemQueryBoundary;
