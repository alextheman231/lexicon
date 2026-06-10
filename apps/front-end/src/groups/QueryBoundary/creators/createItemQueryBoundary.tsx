import type {
  CreateItemQueryBoundaryParameters,
  QueryBoundaryDataProps,
} from "@alextheman/components/QueryBoundary";
import type { JSX } from "react";

import type { LexiconQueryBoundaryComponentsBase } from "src/groups/QueryBoundary/creators/createBaseQueryBoundary";

import { QueryBoundaryData } from "@alextheman/components/QueryBoundary";

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

  return {
    ...baseComponents,
    Data: (props) => {
      return <QueryBoundaryData {...params.query} {...props} />;
    },
  };
}

export default createItemQueryBoundary;
