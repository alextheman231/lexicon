import { Switch } from "@alextheman/components/v7";
import { UUID_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import AuthRequired from "src/components/AuthRequired";
import Blog from "src/resources/Blogs/pages/Blog";
import CreateBlog from "src/resources/Blogs/pages/CreateBlog";
import EditBlog from "src/resources/Blogs/pages/EditBlog";

function BlogsRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_PATTERN})$`)}>
        {({ id }) => {
          return <Blog blogId={id} />;
        }}
      </Route>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_PATTERN})/edit$`)}>
        {({ id }) => {
          return (
            <AuthRequired>
              {(currentUser) => {
                return <EditBlog currentUser={currentUser} blogId={id} />;
              }}
            </AuthRequired>
          );
        }}
      </Route>
      <Route path="/new">
        <AuthRequired>
          {(currentUser) => {
            return <CreateBlog currentUser={currentUser} />;
          }}
        </AuthRequired>
      </Route>
    </Switch>
  );
}

export default BlogsRouter;
