import type { Router } from "express";

import getBlogById from "src/server/routes/blogs/getBlogById";
import getBlogRevisionsByBlogId from "src/server/routes/blogs/getBlogRevisionsByBlogId";
import getBlogs from "src/server/routes/blogs/getBlogs";
import postBlogs from "src/server/routes/blogs/postBlogs";
import putBlogById from "src/server/routes/blogs/putBlogById";
import putBlogToBlogCollections from "src/server/routes/blogs/putBlogToBlogCollections";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseBlogsRouter(router: Router) {
  registerEndpoints(router, {
    getBlogById,
    getBlogRevisionsByBlogId,
    getBlogs,
    postBlogs,
    putBlogById,
    putBlogToBlogCollections,
  });
}

export default initialiseBlogsRouter;
