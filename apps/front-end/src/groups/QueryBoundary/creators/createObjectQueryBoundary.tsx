import type {
  CreateObjectQueryBoundaryParameters,
  QueryBoundaryValueProps,
} from "@alextheman/components/QueryBoundary";
import type { JSX } from "react";

import type { LexiconQueryBoundaryComponentsItem } from "src/groups/QueryBoundary/creators/createItemQueryBoundary";

import { createObjectQueryBoundary as createAlexObjectQueryBoundary } from "@alextheman/components/QueryBoundary";

import createItemQueryBoundary from "src/groups/QueryBoundary/creators/createItemQueryBoundary";

export interface LexiconQueryBoundaryObjectComponents<
  DataType extends object = Record<PropertyKey, unknown>,
> extends LexiconQueryBoundaryComponentsItem<DataType> {
  /**
   * The component responsible for handling values from the data object provided in `createObjectQueryBoundary`.
   *
   * It will extract the value associated with the key specified by `propertyName`, formatting it according to the `valueFormatter` if provided.
   *
   * @template DataType - The type of data being loaded.
   *
   * @throws {DataError} If the data provided by `createObjectQueryBoundary` is not an object, and the `strictlyRequireObject` prop is `true` (it is by default).
   */
  Value: <Key extends keyof DataType>(
    props: Omit<QueryBoundaryValueProps<DataType, Key>, "data" | "isLoading" | "error">,
  ) => JSX.Element;
}

function createObjectQueryBoundary<DataType extends object = Record<PropertyKey, unknown>>(
  params: CreateObjectQueryBoundaryParameters<DataType>,
) {
  const baseComponents = createItemQueryBoundary(params);
  const { Value } = createAlexObjectQueryBoundary(params);

  return {
    ...baseComponents,
    Value,
  };
}

export default createObjectQueryBoundary;
