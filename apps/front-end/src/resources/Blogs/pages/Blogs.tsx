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

import createPaginationGroup from "src/components/pagination";
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
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <PaginationGroup.TableSortLabel columnName="title">
                          Title
                        </PaginationGroup.TableSortLabel>
                      </TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>
                        <PaginationGroup.TableSortLabel columnName="publishedAt">
                          Published at
                        </PaginationGroup.TableSortLabel>
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
                      <PaginationGroup.TablePagination recordCount={totalRecordCount} />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        </Page>
      </QueryBoundary.Context>
    </PaginationGroup.Context>
  );
}

export default Blogs;
