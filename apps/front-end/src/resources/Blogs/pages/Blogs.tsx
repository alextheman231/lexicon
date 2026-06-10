import type { BlogSummary } from "@lexicon/models";

import { Page, useIsLargeScreen } from "@alextheman/components";
import { BlogState } from "@lexicon/models";
import Stack from "@mui/material/Stack";

import createPaginationGroup from "src/groups/pagination";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogsList from "src/resources/Blogs/components/BlogsList";
import BlogsTable from "src/resources/Blogs/components/BlogsTable";
import useBlogsQuery from "src/resources/Blogs/queries/useBlogsQuery";

function Blogs() {
  const isLargeScreen = useIsLargeScreen();

  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "publishedAt",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup<BlogSummary>(pagination);

  const { data, isPending, error } = useBlogsQuery({
    ...pagination.state.paginationSettings,
    state: BlogState.PUBLISHED,
  });
  const { rows: blogs, totalRecordCount } = data ?? {};

  const QueryBoundary = createListQueryBoundary({
    query: { data: blogs, isLoading: isPending, error },
  });

  return (
    <Page title="Welcome to Lexicon!" subtitle="Take a look at some of our blogs.">
      <Stack spacing={1}>
        <QueryBoundary.Error />
        {isLargeScreen ? (
          <BlogsTable
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
            includeAuthor
          />
        ) : (
          <BlogsList
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
            includeAuthor
          />
        )}
      </Stack>
    </Page>
  );
}

export default Blogs;
