import type { BlogSummary, User } from "@lexicon/models";

import { useIsLargeScreen } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { BlogState } from "@lexicon/models";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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
  user: User;
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
    <FormControl fullWidth>
      <InputLabel id="user-blog-state-filter">State</InputLabel>
      <Select
        labelId="user-blog-state-filter"
        value={stateFilter}
        onChange={(event) => {
          setStateFilter(event.target.value);
        }}
        label="State"
      >
        <MenuItem value={BlogState.PUBLISHED}>Published</MenuItem>
        <MenuItem value={BlogState.DRAFT}>Draft</MenuItem>
        <MenuItem value={BlogState.ARCHIVED}>Archived</MenuItem>
      </Select>
    </FormControl>
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
        />
      ) : (
        <BlogsList
          cardContent={user.id === currentUser?.id ? select : null}
          PaginationGroup={PaginationGroup}
          QueryBoundary={QueryBoundary}
          totalRecordCount={totalRecordCount}
        />
      )}
    </Stack>
  );
}

export default UserBlogs;
