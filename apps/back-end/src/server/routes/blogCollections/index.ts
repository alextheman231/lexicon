import type { Router } from "express";

import deleteBlogCollectionItemEndpoint from "src/server/routes/blogCollections/deleteBlogCollectionItemEndpoint";
import getBlogCollectionById from "src/server/routes/blogCollections/getBlogCollectionById";
import getBlogCollectionItemsByBlogCollectionId from "src/server/routes/blogCollections/getBlogCollectionItemsByBlogCollectionId";
import getBlogCollectionOptions from "src/server/routes/blogCollections/getBlogCollectionOptions";
import getBlogCollections from "src/server/routes/blogCollections/getBlogCollections";
import postBlogCollection from "src/server/routes/blogCollections/postBlogCollection";
import putBlogCollectionById from "src/server/routes/blogCollections/putBlogCollectionById";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseBlogCollectionsRouter(router: Router) {
  registerEndpoints(router, {
    deleteBlogCollectionItemEndpoint,
    getBlogCollectionById,
    getBlogCollectionItemsByBlogCollectionId,
    getBlogCollectionOptions,
    getBlogCollections,
    postBlogCollection,
    putBlogCollectionById,
  });
}

export default initialiseBlogCollectionsRouter;
