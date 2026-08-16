import type { BlogSummary } from "@lexicon/models";
import type { ReactNode } from "react";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponentsList } from "src/groups/QueryBoundary/creators/createListQueryBoundary";

import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import BlogDropdown from "src/resources/Blogs/components/BlogDropdown";
import UserLink from "src/resources/Users/components/UserLink";

interface BlogsListProps {
  PaginationGroup: PaginationComponents<BlogSummary>;
  QueryBoundary: LexiconQueryBoundaryComponentsList<BlogSummary>;
  totalRecordCount?: number;
  includeAuthor?: boolean;
  cardContent?: ReactNode;
}

function BlogsList({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeAuthor,
  cardContent,
}: BlogsListProps) {
  return (
    <List>
      {cardContent ? <CardContent>{cardContent}</CardContent> : null}
      <QueryBoundary.DataMap>
        {(blog) => {
          return (
            <ListItem>
              <Card sx={{ width: "100%" }}>
                <CardHeader
                  title={<InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>}
                  action={<BlogDropdown blog={blog} />}
                />
                <CardContent>
                  {includeAuthor ? (
                    <Typography variant="subtitle2">
                      <UserLink
                        userId={blog.authorId}
                        username={blog.authorUsername}
                        displayName={blog.authorDisplayName}
                      />
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
