import type { CreateItemQueryBoundaryParameters } from "@alextheman/components";

import type { LexiconQueryBoundaryComponentsBase } from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

import { QueryBoundaryData } from "@alextheman/components";

import createBaseQueryBoundary from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

export interface LexiconQueryBoundaryComponentsItem<
  DataType,
> extends LexiconQueryBoundaryComponentsBase {
  Data: typeof QueryBoundaryData<DataType>;
}

function createItemQueryBoundary<DataType>(
  params: CreateItemQueryBoundaryParameters<DataType>,
): LexiconQueryBoundaryComponentsItem<DataType> {
  const baseComponents = createBaseQueryBoundary(params);

  return {
    ...baseComponents,
    Data: QueryBoundaryData,
  };
}

export default createItemQueryBoundary;
