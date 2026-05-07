import type { BlogSummary } from "@lexicon/models";

import { Page, QueryBoundaryError } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import { parseBlogSummary } from "@lexicon/models";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import PaginationProvider from "src/components/PaginationProvider";
import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";
import TablePagination from "src/components/TablePagination";
import TableSortLabel from "src/components/TableSortLabel";
import usePagination from "src/hooks/usePagination";
import { useBlogsQuery } from "src/resources/Blogs/queries";

function Blogs() {
  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "publishedAt",
    sortDirection: "desc",
  });
  const [{ paginationSettings }] = pagination;

  const { data, isPending, error } = useBlogsQuery(paginationSettings);
  const { rows: blogs, totalRecordCount } = data ?? {};

  return (
    <PaginationProvider pagination={pagination}>
      <QueryBoundaryProvider data={blogs} isLoading={isPending} error={error}>
        <Page title="Welcome to Lexicon!" subtitle="Take a look at some of our blogs.">
          <Stack spacing={1}>
            <QueryBoundaryError />
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel<BlogSummary> columnName="title">Title</TableSortLabel>
                      </TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>
                        <TableSortLabel<BlogSummary> columnName="publishedAt">
                          Published at
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <QueryBoundaryDataRowsMap itemParser={parseBlogSummary} columns={3}>
                      {(blog) => {
                        return (
                          <TableRow>
                            <TableCell>
                              <InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>
                            </TableCell>
                            <TableCell>
                              {blog.authorDisplayName} (
                              <InternalLink to={`/users/${blog.authorId}`}>
                                {blog.authorUsername}
                              </InternalLink>
                              )
                            </TableCell>
                            <TableCell>
                              {blog.publishedAt
                                ? formatDateAndTime(blog.publishedAt)
                                : "Not published yet"}
                            </TableCell>
                          </TableRow>
                        );
                      }}
                    </QueryBoundaryDataRowsMap>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination<BlogSummary> recordCount={totalRecordCount} />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        </Page>
      </QueryBoundaryProvider>
    </PaginationProvider>
  );
}

export default Blogs;
