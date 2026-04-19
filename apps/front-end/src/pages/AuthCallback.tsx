import { Page } from "@alextheman/components";
import { wait } from "@alextheman/utility";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import { useLocation } from "wouter";

import { useAuth } from "src/AuthContextProvider";

function AuthCallback() {
  const { authenticate } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    (async () => {
      await Promise.all([authenticate(), wait(2)]);
      setLocation("/");
    })();
  }, []);

  return (
    <Page title="Authenticating...">
      Signing in...
      <CircularProgress />
    </Page>
  );
}

export default AuthCallback;
