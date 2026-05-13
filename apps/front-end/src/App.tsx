import { ModeProvider, SnackbarProvider } from "@alextheman/components";
import { ErrorBoundary } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContextProvider from "src/AuthContextProvider";
import ErrorPage from "src/pages/ErrorPage";
import Router from "src/Router";

const queryClient = new QueryClient();

function App() {
  return (
    <ModeProvider>
      <ErrorBoundary fallback={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <SnackbarProvider>
              <Router />
            </SnackbarProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ModeProvider>
  );
}

export default App;
