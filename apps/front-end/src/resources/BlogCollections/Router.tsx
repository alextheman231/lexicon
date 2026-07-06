import { Switch } from "@alextheman/components/routing";
import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import BlogCollection from "src/resources/BlogCollections/pages/BlogCollection";

function BlogCollectionsRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_REGEX_PATTERN})$`)}>
        {({ id }) => {
          return <BlogCollection blogCollectionId={id} />;
        }}
      </Route>
    </Switch>
  );
}

export default BlogCollectionsRouter;
