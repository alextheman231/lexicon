import { Switch } from "@alextheman/components/v7";
import { Route } from "wouter";

import CreateBlog from "src/resources/Blogs/pages/CreateBlog";

function BlogsRouter() {
  return (
    <Switch>
      <Route path="/new">
        <CreateBlog />
      </Route>
    </Switch>
  );
}

export default BlogsRouter;
