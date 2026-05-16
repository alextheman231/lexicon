import { Router as AlexRouter, Switch } from "@alextheman/components/v7";
import { CodeError } from "@alextheman/utility/v6";
import { Route } from "wouter";

import BackendError from "src/components/BackendError";
import PageWrapper from "src/components/PageWrapper";
import AuthCallback from "src/pages/AuthCallback";
import Blogs from "src/resources/Blogs/pages/Blogs";
import BlogsRouter from "src/resources/Blogs/Router";
import EditUserProfile from "src/resources/Users/pages/EditUserProfile";
import UsersRouter from "src/resources/Users/Router";

function Router() {
  return (
    <AlexRouter>
      <PageWrapper>
        <Switch>
          <Route path="/">
            <Blogs />
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
          <Route path="/control/fe-error">
            {() => {
              throw new CodeError(
                "TEST_ERROR",
                "This is an error that should crash the page and report to Sentry.",
              );
            }}
          </Route>
          <Route path="/control/be-error">
            <BackendError />
          </Route>
        </Switch>
      </PageWrapper>
    </AlexRouter>
  );
}

export default Router;
