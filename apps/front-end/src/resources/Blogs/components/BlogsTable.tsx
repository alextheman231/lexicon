import type { BlogSummary } from "@lexicon/models";
import type { ReactNode } from "react";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponentsList } from "src/groups/QueryBoundary/creators/createListQueryBoundary";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MdMoreVert } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";

interface BlogsTableProps {
  PaginationGroup: PaginationComponents<BlogSummary>;
  QueryBoundary: LexiconQueryBoundaryComponentsList<BlogSummary>;
  totalRecordCount?: number;
  includeAuthor?: boolean;
  cardContent?: ReactNode;
}

function BlogsTable({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeAuthor,
  cardContent,
}: BlogsTableProps) {
  const { currentUser } = useAuth();

  return (
    <Card>
      {cardContent ? (
        <>
          <CardContent>{cardContent}</CardContent>
          <Divider />
        </>
      ) : null}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <PaginationGroup.TableSortLabel columnName="title">
                  Title
                </PaginationGroup.TableSortLabel>
              </TableCell>
              {includeAuthor ? <TableCell>Author</TableCell> : null}
              <TableCell>
                <PaginationGroup.TableSortLabel columnName="publishedAt">
                  Published at
                </PaginationGroup.TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <QueryBoundary.DataRowsMap columns={includeAuthor ? 4 : 3}>
              {(blog) => {
                return (
                  <TableRow>
                    <TableCell>
                      <InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>
                    </TableCell>
                    {includeAuthor ? (
                      <TableCell>
                        {blog.authorDisplayName} (
                        <InternalLink to={`/users/${blog.authorId}`}>
                          {blog.authorUsername}
                        </InternalLink>
                        )
                      </TableCell>
                    ) : null}
                    <TableCell>
                      {blog.publishedAt ? formatDateAndTime(blog.publishedAt) : "Not published yet"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenuProvider>
                        <DropdownMenuTrigger component={IconButton}>
                          <MdMoreVert />
                        </DropdownMenuTrigger>
                        <DropdownMenu>
                          {currentUser?.id === blog.authorId ? (
                            <DropdownMenuItem
                              component={InternalLink}
                              to={`/blogs/${blog.id}/edit`}
                            >
                              Edit
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem>
                            Add to collection (implementation coming soon)
                          </DropdownMenuItem>
                        </DropdownMenu>
                      </DropdownMenuProvider>
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
  );
}

export default BlogsTable;
