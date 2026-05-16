import type { BlogSummary } from "@lexicon/models";

import { Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
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
import TablePagination from "src/components/TablePagination";
import TableSortLabel from "src/components/TableSortLabel";
import createQueryBoundary from "src/hooks/createQueryBoundary";
import usePagination from "src/hooks/usePagination";
import { useBlogsQuery } from "src/resources/Blogs/queries";

function Blogs() {
  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "publishedAt",
    sortDirection: "desc",
  });

  const { data, isPending, error } = useBlogsQuery(pagination.state.paginationSettings);
  const { rows: blogs, totalRecordCount } = data ?? {};

  const QueryBoundary = createQueryBoundary({
    query: { dataCollection: blogs, isLoading: isPending, error },
  });

  return (
    <PaginationProvider pagination={pagination}>
      <QueryBoundary.Context>
        <Page title="Welcome to Lexicon!" subtitle="Take a look at some of our blogs.">
          <Stack spacing={1}>
            <QueryBoundary.Error />
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
                    <QueryBoundary.DataRowsMap columns={3}>
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
                    </QueryBoundary.DataRowsMap>
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
      </QueryBoundary.Context>
    </PaginationProvider>
  );
}

export default Blogs;
