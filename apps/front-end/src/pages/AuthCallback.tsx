import { Page } from "@alextheman/components";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import { useLocation } from "wouter";

import { useAuth } from "src/AuthContextProvider";

function AuthCallback() {
  const { authenticate } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    authenticate();
    setLocation("/");
  }, []);

  return (
    <Page title="Authenticating...">
      Signing in...
      <CircularProgress />
    </Page>
  );
}

export default AuthCallback;
