import type { BlogCollectionView, User } from "@lexicon/models";

import { useIsLargeScreen } from "@alextheman/components";
import Stack from "@mui/material/Stack";

import createPaginationGroup from "src/groups/pagination";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogCollectionsList from "src/resources/BlogCollections/components/BlogCollectionsList";
import BlogCollectionsTable from "src/resources/BlogCollections/components/BlogCollectionsTable";
import useBlogCollectionsQuery from "src/resources/BlogCollections/queries/useBlogCollectionsQuery";

interface UserBlogCollectionsProps {
  user: User;
}

function UserBlogCollections({ user }: UserBlogCollectionsProps) {
  const pagination = usePagination<BlogCollectionView>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "createdAt",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup(pagination);
  const { data, isPending, error } = useBlogCollectionsQuery({
    ...pagination.state.paginationSettings,
    userId: user.id,
  });
  const QueryBoundary = createListQueryBoundary({
    query: { data: data?.blogCollections, isLoading: isPending, error },
  });
  const isLargeScreen = useIsLargeScreen();

  return (
    <Stack spacing={2}>
      {isLargeScreen ? (
        <BlogCollectionsTable
          PaginationGroup={PaginationGroup}
          QueryBoundary={QueryBoundary}
          totalRecordCount={data?.count}
        />
      ) : (
        <BlogCollectionsList
          PaginationGroup={PaginationGroup}
          QueryBoundary={QueryBoundary}
          totalRecordCount={data?.count}
        />
      )}
    </Stack>
  );
}

export default UserBlogCollections;
