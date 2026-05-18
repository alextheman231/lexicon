import type { BlogSummary } from "@lexicon/models";

import { Page, useScreenSize } from "@alextheman/components";
import Stack from "@mui/material/Stack";

import createPaginationGroup from "src/groups/pagination";
import createQueryBoundary from "src/groups/QueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogsList from "src/resources/Blogs/components/BlogsList";
import BlogsTable from "src/resources/Blogs/components/BlogsTable";
import { useBlogsQuery } from "src/resources/Blogs/queries";

function Blogs() {
  const { isLargeScreen } = useScreenSize();

  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "publishedAt",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup<BlogSummary>(pagination);

  const { data, isPending, error } = useBlogsQuery(pagination.state.paginationSettings);
  const { rows: blogs, totalRecordCount } = data ?? {};

  const QueryBoundary = createQueryBoundary({
    query: { dataCollection: blogs, isLoading: isPending, error },
  });

  return (
    <PaginationGroup.Context>
      <QueryBoundary.Context>
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
      </QueryBoundary.Context>
    </PaginationGroup.Context>
  );
}

export default Blogs;
