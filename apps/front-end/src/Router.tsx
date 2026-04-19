import { Router as AlexRouter, Switch } from "@alextheman/components/v7";
import { Route } from "wouter";

import Editor from "src/components/Editor";
import PageWrapper from "src/components/PageWrapper";
import AuthCallback from "src/pages/AuthCallback";

function Router() {
  return (
    <AlexRouter>
      <PageWrapper>
        <Switch>
          <Route path="/">
            <Editor />
          </Route>
          <Route path="/auth/callback">
            <AuthCallback />
          </Route>
        </Switch>
      </PageWrapper>
    </AlexRouter>
  );
}

export default Router;
