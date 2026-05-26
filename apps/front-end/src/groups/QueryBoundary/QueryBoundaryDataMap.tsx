import type { QueryBoundaryDataMapProps } from "@alextheman/components/QueryBoundary";

import { QueryBoundaryDataMap as AlexQueryBoundaryDataMap } from "@alextheman/components/QueryBoundary";

function QueryBoundaryDataMap<ItemType>({
  itemKey,
  children,
  ...props
}: QueryBoundaryDataMapProps<ItemType>) {
  return (
    <AlexQueryBoundaryDataMap
      {...props}
      itemKey={
        itemKey ??
        ((item, index) => {
          return typeof item === "object" &&
            item !== null &&
            "id" in item &&
            (typeof item.id === "string" || typeof item.id === "number")
            ? item.id
            : index;
        })
      }
    >
      {children}
    </AlexQueryBoundaryDataMap>
  );
}

export default QueryBoundaryDataMap;
