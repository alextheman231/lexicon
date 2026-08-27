import type { BlogCollectionItemSummary } from "@lexicon/models";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponentsList } from "src/groups/QueryBoundary/creators/createListQueryBoundary";

import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import BlogCollectionItemsDropdown from "src/resources/BlogCollections/components/BlogCollectionsItemsDropdown";
import UserLink from "src/resources/Users/components/UserLink";

interface BlogCollectionItemsTableProps {
  QueryBoundaryItems: LexiconQueryBoundaryComponentsList<BlogCollectionItemSummary>;
  PaginationGroup: PaginationComponents<BlogCollectionItemSummary>;
  totalRecordCount?: number;
}

function BlogCollectionItemsTable({
  QueryBoundaryItems,
  PaginationGroup,
  totalRecordCount,
}: BlogCollectionItemsTableProps) {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Blog</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <QueryBoundaryItems.DataRowsMap columns={5}>
              {(item) => {
                return (
                  <TableRow>
                    <TableCell>
                      <InternalLink to={`/blogs/${item.blogId}`}>{item.blogTitle}</InternalLink>
                    </TableCell>
                    <TableCell>
                      <UserLink
                        userId={item.authorId}
                        username={item.authorUsername}
                        displayName={item.authorDisplayName}
                        profilePictureUrl={item.authorProfilePictureUrl}
                      />
                    </TableCell>
                    <TableCell>
                      {item.blogPublishedAt !== null
                        ? formatDateAndTime(item.blogPublishedAt)
                        : "Not published yet"}
                    </TableCell>
                    <TableCell>{formatDateAndTime(item.createdAt)}</TableCell>
                    <TableCell>
                      <BlogCollectionItemsDropdown
                        blogId={item.blogId}
                        blogCollectionId={item.blogCollectionId}
                        blogCollectionItemId={item.id}
                      />
                    </TableCell>
                  </TableRow>
                );
              }}
            </QueryBoundaryItems.DataRowsMap>
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

export default BlogCollectionItemsTable;
