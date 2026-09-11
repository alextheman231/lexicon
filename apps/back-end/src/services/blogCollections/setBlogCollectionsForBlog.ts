import type { Transaction } from "src/database/connection";

import { DataError } from "@alextheman/utility/v6";
import { BlogState } from "@lexicon/models";

import selectBlog from "src/models/blogs/selectBlog";
import createBlogCollectionItems from "src/services/blogCollections/createBlogCollectionItems";
import queryBlogCollectionIds from "src/services/blogCollections/queryBlogCollectionIds";
import removeBlogCollectionItem from "src/services/blogCollections/removeBlogCollectionItem";

async function setBlogCollectionsForBlog(
  connection: Transaction,
  blogId: string,
  desiredCollectionIds: Array<string>,
): Promise<void> {
  const blog = await selectBlog(connection, blogId);

  if (blog === null) {
    return;
  }

  if (blog.state === BlogState.ARCHIVED) {
    throw new DataError(
      { resourceType: "blog", resourceId: blog.id },
      "RESOURCE_NOT_FOUND",
      "Could not find blog in database.",
    );
  }

  const currentCollectionIds = await queryBlogCollectionIds(connection, { blogId });

  const collectionsToAddTo: Array<string> = [];
  const collectionsToRemoveFrom: Array<string> = [];

  for (const desiredCollectionId of desiredCollectionIds) {
    if (!currentCollectionIds.includes(desiredCollectionId)) {
      collectionsToAddTo.push(desiredCollectionId);
    }
  }
  for (const currentCollectionId of currentCollectionIds) {
    if (!desiredCollectionIds.includes(currentCollectionId)) {
      collectionsToRemoveFrom.push(currentCollectionId);
    }
  }

  // TODO: Change the function signature so that these loops are not needed
  for (const blogCollectionId of collectionsToAddTo) {
    await createBlogCollectionItems(connection, blogCollectionId, [{ blogId }]);
  }
  for (const blogCollectionId of collectionsToRemoveFrom) {
    await removeBlogCollectionItem(connection, blogCollectionId, { blogId });
  }
}

export default setBlogCollectionsForBlog;
