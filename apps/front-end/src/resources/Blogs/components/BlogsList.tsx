import type { BlogSummary } from "@lexicon/models";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponents } from "src/groups/QueryBoundary";

import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

interface BlogsListProps {
  PaginationGroup: PaginationComponents<BlogSummary>;
  QueryBoundary: LexiconQueryBoundaryComponents<BlogSummary>;
  totalRecordCount?: number;
  includeAuthor?: boolean;
}

function BlogsList({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeAuthor,
}: BlogsListProps) {
  return (
    <List>
      <QueryBoundary.DataMap>
        {(blog) => {
          return (
            <ListItem>
              <Card sx={{ width: "100%" }}>
                <CardHeader
                  title={<InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>}
                />
                <CardContent>
                  {includeAuthor ? (
                    <Typography variant="subtitle2">
                      {blog.authorDisplayName} (
                      <InternalLink to={`/users/${blog.authorId}`}>
                        {blog.authorUsername}
                      </InternalLink>
                      )
                    </Typography>
                  ) : null}
                  <Typography variant="subtitle2">
                    Published:{" "}
                    {blog.publishedAt ? formatDateAndTime(blog.publishedAt) : "Not published yet"}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          );
        }}
      </QueryBoundary.DataMap>
      <PaginationGroup.ListPagination totalRecordCount={totalRecordCount} />
    </List>
  );
}

export default BlogsList;
