import { Switch } from "@alextheman/components/v7";
import { UUID_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import Blog from "src/resources/Blogs/pages/Blog";
import CreateBlog from "src/resources/Blogs/pages/CreateBlog";

function BlogsRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_PATTERN})$`)}>
        {({ id }) => {
          return <Blog blogId={id} />;
        }}
      </Route>
      <Route path="/new">
        <CreateBlog />
      </Route>
    </Switch>
  );
}

export default BlogsRouter;
