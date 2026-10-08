import type { BlogSummary, UserProfile } from "@lexicon/models";

import { SelectInput, useIsLargeScreen } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { BlogState, formatBlogState } from "@lexicon/models";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";

import { useAuth } from "src/AuthContextProvider";
import createPaginationGroup from "src/groups/pagination";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogsList from "src/resources/Blogs/components/BlogsList";
import BlogsTable from "src/resources/Blogs/components/BlogsTable";
import useBlogsQuery from "src/resources/Blogs/queries/useBlogsQuery";

interface UserBlogsProps {
  user: UserProfile;
}

function UserBlogs({ user }: UserBlogsProps) {
  const isLargeScreen = useIsLargeScreen();
  const { currentUser } = useAuth();
  const [stateFilter, setStateFilter] = useState<BlogState>(BlogState.PUBLISHED);

  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: stateFilter === BlogState.PUBLISHED ? "publishedAt" : "updatedAt",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup<BlogSummary>(pagination);

  const { data, isPending, error } = useBlogsQuery({
    ...pagination.state.paginationSettings,
    authorId: user.id,
    state: user.id === currentUser?.id ? stateFilter : BlogState.PUBLISHED,
  });
  const { rows: blogs, totalRecordCount } = data ?? {};
  const QueryBoundary = createListQueryBoundary({
    query: { data: blogs, isLoading: isPending, error },
  });

  const select = (
    <SelectInput<BlogState>
      fullWidth
      label="State"
      value={stateFilter}
      onChange={(value) => {
        setStateFilter(value);
      }}
      options={Object.values(BlogState).map((value) => {
        return { label: formatBlogState(value), value };
      })}
    />
  );

  return (
    <Stack spacing={2}>
      {user.id === currentUser?.id ? (
        <Button fullWidth component={InternalLink} to="/blogs/new" variant="contained">
          + Create Blog
        </Button>
      ) : null}
      <QueryBoundary.Error />
      {isLargeScreen ? (
        <BlogsTable
          cardContent={user.id === currentUser?.id ? select : null}
          PaginationGroup={PaginationGroup}
          QueryBoundary={QueryBoundary}
          totalRecordCount={totalRecordCount}
          dateColumn={BlogState.DRAFT ? "updatedAt" : "publishedAt"}
        />
      ) : (
        <BlogsList
          cardContent={user.id === currentUser?.id ? select : null}
          PaginationGroup={PaginationGroup}
          QueryBoundary={QueryBoundary}
          totalRecordCount={totalRecordCount}
          dateColumn={BlogState.DRAFT ? "updatedAt" : "publishedAt"}
        />
      )}
    </Stack>
  );
}

export default UserBlogs;
