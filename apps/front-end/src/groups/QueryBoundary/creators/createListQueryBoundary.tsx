import type { CreateListQueryBoundaryParameters } from "@alextheman/components/QueryBoundary";

import type { LexiconQueryBoundaryComponentsBase } from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

import createBaseQueryBoundary from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";
import QueryBoundaryDataMap from "src/groups/QueryBoundary/QueryBoundaryDataMap";
import QueryBoundaryDataRowsMap from "src/groups/QueryBoundary/QueryBoundaryDataRowsMap";

export interface LexiconQueryBoundaryComponentsList<
  ItemType,
> extends LexiconQueryBoundaryComponentsBase {
  DataMap: typeof QueryBoundaryDataMap<ItemType>;
  DataRowsMap: typeof QueryBoundaryDataRowsMap<ItemType>;
}

function createListQueryBoundary<ItemType>(
  params: CreateListQueryBoundaryParameters<ItemType>,
): LexiconQueryBoundaryComponentsList<ItemType> {
  const baseComponents = createBaseQueryBoundary(params);

  return {
    ...baseComponents,
    DataMap: QueryBoundaryDataMap,
    DataRowsMap: QueryBoundaryDataRowsMap,
  };
}

export default createListQueryBoundary;
