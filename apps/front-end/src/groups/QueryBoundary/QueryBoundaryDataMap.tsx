import type { QueryBoundaryDataMapProps } from "@alextheman/components/QueryBoundary";

import { QueryBoundaryDataMap as AlexQueryBoundaryDataMap } from "@alextheman/components/QueryBoundary";
import { containsKeys } from "@alextheman/utility";
import Skeleton from "@mui/material/Skeleton";

function QueryBoundaryDataMap<ItemType>({
  itemKey,
  children,
  ...props
}: QueryBoundaryDataMapProps<ItemType>) {
  return (
    <AlexQueryBoundaryDataMap
      loadingFallback={<Skeleton />}
      {...props}
      itemKey={
        itemKey ??
        ((item, index) => {
          return containsKeys(item, "id") &&
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
