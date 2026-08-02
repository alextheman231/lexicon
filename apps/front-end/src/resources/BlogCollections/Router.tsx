import { Switch } from "@alextheman/components/routing";
import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import AuthRequired from "src/components/AuthRequired";
import BlogCollection from "src/resources/BlogCollections/pages/BlogCollection";
import CreateBlogCollection from "src/resources/BlogCollections/pages/CreateBlogCollection";

function BlogCollectionsRouter() {
  return (
    <Switch>
      <Route path="/new">
        <AuthRequired>
          {(currentUser) => {
            return <CreateBlogCollection currentUser={currentUser} />;
          }}
        </AuthRequired>
      </Route>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_REGEX_PATTERN})$`)}>
        {({ id }) => {
          return <BlogCollection blogCollectionId={id} />;
        }}
      </Route>
    </Switch>
  );
}

export default BlogCollectionsRouter;
