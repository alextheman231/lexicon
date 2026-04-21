import { Switch } from "@alextheman/components/v7";
import { UUID_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import UserProfile from "src/resources/Users/pages/UserProfile";

function UsersRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_PATTERN})$`)}>
        {({ id }) => {
          return <UserProfile userId={id} />;
        }}
      </Route>
    </Switch>
  );
}

export default UsersRouter;
