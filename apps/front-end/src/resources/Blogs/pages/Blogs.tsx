import type { BlogSummary } from "@lexicon/models";

import { Page, Search, useIsLargeScreen } from "@alextheman/components";
import { BlogState } from "@lexicon/models";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import createPaginationGroup from "src/groups/pagination";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import usePagination from "src/hooks/usePagination";
import LexiconLogo from "src/icons/LexiconLogo";
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
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const { data, isPending, error, refetch } = useBlogsQuery({
    ...pagination.state.paginationSettings,
    searchQuery,
    state: BlogState.PUBLISHED,
  });
  const { rows: blogs, totalRecordCount } = data ?? {};

  const QueryBoundary = createListQueryBoundary({
    query: { data: blogs, isLoading: isPending, error },
  });

  async function handleSearch() {
    pagination.actions.setPageNumber(0);
    setSearchQuery(pagination.state.rawSearch === "" ? undefined : pagination.state.rawSearch);
    await refetch();
  }

  return (
    <Page
      title={
        <Stack spacing={2}>
          <LexiconLogo style={{ height: 200, width: 200 }} />
          <Typography variant="h6">Welcome to Lexicon!</Typography>
        </Stack>
      }
      subtitle="Take a look at some of our blogs."
    >
      <Stack spacing={1}>
        <QueryBoundary.Error />
        {isLargeScreen ? (
          <BlogsTable
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
            includeAuthor
            cardContent={
              <Search
                fullWidth
                rawSearch={pagination.state.rawSearch}
                setRawSearch={pagination.actions.setRawSearch}
                handleSearch={handleSearch}
              />
            }
          />
        ) : (
          <BlogsList
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
            includeAuthor
            cardContent={
              <Search
                fullWidth
                rawSearch={pagination.state.rawSearch}
                setRawSearch={pagination.actions.setRawSearch}
                handleSearch={handleSearch}
              />
            }
          />
        )}
      </Stack>
    </Page>
  );
}

export default Blogs;
