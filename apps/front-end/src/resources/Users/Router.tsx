import { Switch } from "@alextheman/components/routing";
import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import UserProfile from "src/resources/Users/pages/UserProfile";

function UsersRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_REGEX_PATTERN})$`)}>
        {({ id }) => {
          return <UserProfile userId={id} />;
        }}
      </Route>
    </Switch>
  );
}

export default UsersRouter;
