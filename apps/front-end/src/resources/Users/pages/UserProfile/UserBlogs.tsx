import type { BlogSummary, User } from "@lexicon/models";

import { useScreenSize } from "@alextheman/components";

import createPaginationGroup from "src/groups/pagination";
import createQueryBoundary from "src/groups/QueryBoundary";
import usePagination from "src/hooks/usePagination";
import BlogsList from "src/resources/Blogs/components/BlogsList";
import BlogsTable from "src/resources/Blogs/components/BlogsTable";
import { useBlogsQuery } from "src/resources/Blogs/queries";

interface UserBlogsProps {
  user: User;
}

function UserBlogs({ user }: UserBlogsProps) {
  const { isLargeScreen } = useScreenSize();

  const pagination = usePagination<BlogSummary>({
    pageNumber: 0,
    pageSize: 100,
    sortColumn: "publishedAt",
    sortDirection: "desc",
  });
  const PaginationGroup = createPaginationGroup<BlogSummary>(pagination);

  const { data, isPending, error } = useBlogsQuery({
    ...pagination.state.paginationSettings,
    authorId: user.id,
  });
  const { rows: blogs, totalRecordCount } = data ?? {};
  const QueryBoundary = createQueryBoundary({
    query: { dataCollection: blogs, isLoading: isPending, error },
  });

  return (
    <PaginationGroup.Context>
      <QueryBoundary.Context>
        <QueryBoundary.Error />
        {isLargeScreen ? (
          <BlogsTable
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
          />
        ) : (
          <BlogsList
            PaginationGroup={PaginationGroup}
            QueryBoundary={QueryBoundary}
            totalRecordCount={totalRecordCount}
          />
        )}
      </QueryBoundary.Context>
    </PaginationGroup.Context>
  );
}

export default UserBlogs;
