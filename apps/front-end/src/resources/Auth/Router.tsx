import { Switch } from "@alextheman/components/routing";
import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import CompleteSignUp from "src/resources/Auth/pages/CompleteSignUp";
import CompleteSignUpMessagePage from "src/resources/Auth/pages/CompleteSignUpMessagePage";
import ForgottenPassword from "src/resources/Auth/pages/ForgottenPassword";
import ForgottenPasswordEmailRedirect from "src/resources/Auth/pages/ForgottenPasswordEmailRedirect";
import ResetPassword from "src/resources/Auth/pages/ResetPassword";
import SignIn from "src/resources/Auth/pages/SignIn";
import SignUp from "src/resources/Auth/pages/SignUp";

function AuthRouter() {
  return (
    <Switch>
      <Route path="/sign-in">
        <SignIn />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/complete-sign-up">
        <CompleteSignUp />
      </Route>
      <Route path="/forgotten-password">
        <ForgottenPassword />
      </Route>
      <Route path="/forgotten-password/email-redirect">
        <ForgottenPasswordEmailRedirect />
      </Route>
      <Route path="/reset-password">
        <ResetPassword />
      </Route>
      <Route<{ userId: string }>
        path={RegExp(`^/sign-up/(?<userId>${UUID_REGEX_PATTERN})/email-redirect`)}
      >
        {({ userId }) => {
          return <CompleteSignUpMessagePage userId={userId} />;
        }}
      </Route>
    </Switch>
  );
}

export default AuthRouter;
