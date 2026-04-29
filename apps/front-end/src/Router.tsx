import { Router as AlexRouter, Switch } from "@alextheman/components/v7";
import { Route } from "wouter";

import PageWrapper from "src/components/PageWrapper";
import AuthCallback from "src/pages/AuthCallback";
import BlogEditor from "src/resources/Blogs/components/BlogEditor";
import BlogsRouter from "src/resources/Blogs/Router";
import EditUserProfile from "src/resources/Users/pages/EditUserProfile";
import UsersRouter from "src/resources/Users/Router";

function Router() {
  return (
    <AlexRouter>
      <PageWrapper>
        <Switch>
          <Route path="/">
            <BlogEditor />
          </Route>
          <Route path="/auth/callback">
            <AuthCallback />
          </Route>
          <Route path="/account/edit">
            <EditUserProfile />
          </Route>
          <Route path="/users" nest>
            <UsersRouter />
          </Route>
          <Route path="/blogs" nest>
            <BlogsRouter />
          </Route>
        </Switch>
      </PageWrapper>
    </AlexRouter>
  );
}

export default Router;
