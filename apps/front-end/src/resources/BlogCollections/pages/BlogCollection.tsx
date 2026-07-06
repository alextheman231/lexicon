import type { BlogCollectionItemSummary } from "@lexicon/models";

import { Page, useIsLargeScreen } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Typography from "@mui/material/Typography";

import createPaginationGroup from "src/groups/pagination";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogCollectionItemsList from "src/resources/BlogCollections/components/BlogCollectionItemsList";
import BlogCollectionItemsTable from "src/resources/BlogCollections/components/BlogCollectionItemsTable";
import useBlogCollectionItemsQuery from "src/resources/BlogCollections/queries/useBlogCollectionItemsQuery";
import useBlogCollectionQuery from "src/resources/BlogCollections/queries/useBlogCollectionQuery";

interface BlogCollectionProps {
  blogCollectionId: string;
}

function BlogCollection({ blogCollectionId }: BlogCollectionProps) {
  const { data, isPending, error } = useBlogCollectionQuery(blogCollectionId);

  const pagination = usePagination<BlogCollectionItemSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "itemNumber",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup<BlogCollectionItemSummary>(pagination);

  const {
    data: itemsPayload,
    isPending: isItemsPending,
    error: itemsError,
  } = useBlogCollectionItemsQuery(blogCollectionId, pagination.state.paginationSettings);

  const QueryBoundaryCollection = createObjectQueryBoundary({
    query: { data, isLoading: isPending, error },
  });
  const QueryBoundaryItems = createListQueryBoundary({
    query: { data: itemsPayload?.items, isLoading: isItemsPending, error: itemsError },
  });

  const isLargeScreen = useIsLargeScreen();

  return (
    <Page
      title={<QueryBoundaryCollection.Value propertyName="name" />}
      subtitle={
        <QueryBoundaryCollection.Data>
          {(blogCollection) => {
            return (
              <Typography variant="subtitle2">
                By: {blogCollection.userDisplayName ?? blogCollection.username} (
                <InternalLink to={`/users/${blogCollection.userId}`}>
                  {blogCollection.username}
                </InternalLink>
                ), Created at: {formatDateAndTime(blogCollection.createdAt)}
              </Typography>
            );
          }}
        </QueryBoundaryCollection.Data>
      }
    >
      {isLargeScreen ? (
        <BlogCollectionItemsTable
          PaginationGroup={PaginationGroup}
          QueryBoundaryItems={QueryBoundaryItems}
          totalRecordCount={itemsPayload?.count}
        />
      ) : (
        <BlogCollectionItemsList
          PaginationGroup={PaginationGroup}
          QueryBoundaryItems={QueryBoundaryItems}
          totalRecordCount={itemsPayload?.count}
        />
      )}
    </Page>
  );
}

export default BlogCollection;
