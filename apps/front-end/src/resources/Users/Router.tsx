import { Switch } from "@alextheman/components/routing";
import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { Route } from "wouter";

import CompleteSignUp from "src/resources/Users/pages/CompleteSignUp";
import CompleteSignUpMessagePage from "src/resources/Users/pages/CompleteSignUpMessagePage";
import ForgottenPassword from "src/resources/Users/pages/ForgottenPassword";
import ForgottenPasswordEmailRedirect from "src/resources/Users/pages/ForgottenPasswordEmailRedirect";
import ResetPassword from "src/resources/Users/pages/ResetPassword";
import SignIn from "src/resources/Users/pages/SignIn";
import SignUp from "src/resources/Users/pages/SignUp";
import UserProfile from "src/resources/Users/pages/UserProfile";

function UsersRouter() {
  return (
    <Switch>
      <Route<{ id: string }> path={RegExp(`^/(?<id>${UUID_REGEX_PATTERN})$`)}>
        {({ id }) => {
          return <UserProfile userId={id} />;
        }}
      </Route>
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

export default UsersRouter;
