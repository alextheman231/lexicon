import { DropdownMenuItem } from "@alextheman/components/DropdownMenu";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import createItemQueryBoundary from "src/groups/QueryBoundary/creators/createItemQueryBoundary";
import useRemoveBlogCollectionItemMutation from "src/resources/BlogCollections/queries/useRemoveBlogCollectionItemMutation";
import BlogDropdown from "src/resources/Blogs/components/BlogDropdown";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import formatError from "src/utility/errors/formatError";

interface BlogCollectionsDropdownProps {
  blogId: string;
  blogCollectionId: string;
  blogCollectionItemId: string;
}

function BlogCollectionItemsDropdown({
  blogId,
  blogCollectionId,
  blogCollectionItemId,
}: BlogCollectionsDropdownProps) {
  const { data: blog, isPending, error } = useBlogQuery(blogId);
  const QueryBoundary = createItemQueryBoundary({
    query: { data: blog, isLoading: isPending, error },
  });
  const { mutateAsync: removeItem } = useRemoveBlogCollectionItemMutation(
    blogCollectionId,
    blogCollectionItemId,
  );
  const { addSnackbar } = useSnackbarContext();

  // For some reason, using `QueryBoundary.Data` to render the dropdown causes issues where the dropdown doesn't seem to open.
  // As such, these checks must be done manually for now - I will investigate this bug in the meantime.
  if (isPending) {
    return <Skeleton />;
  }

  if (blog === undefined || blog === null) {
    return <Typography>Blog not available</Typography>;
  }

  async function handleItemRemoval() {
    try {
      await removeItem();
      addSnackbar("Blog removed from collection.", { severity: "success" });
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <>
      <QueryBoundary.Error />
      <BlogDropdown
        blog={blog}
        extraItems={{
          insertLocation: "bottom",
          items: <DropdownMenuItem onClick={handleItemRemoval}>Remove item</DropdownMenuItem>,
        }}
      />
    </>
  );
}

export default BlogCollectionItemsDropdown;
