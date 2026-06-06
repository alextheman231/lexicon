import { SnackbarProvider, Snackbars } from "@alextheman/components/snackbar";
import { ThemeProvider } from "@alextheman/components/theme";
import { ErrorBoundary } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContextProvider from "src/AuthContextProvider";
import ErrorPage from "src/pages/ErrorPage";
import Router from "src/Router";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <SnackbarProvider>
              <Snackbars />
              <Router />
            </SnackbarProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
//
export default App;
