import { SnackbarProvider, Snackbars } from "@alextheman/components/snackbar";
import { defaultThemeOptions } from "@alextheman/components/v8/theme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import deepmerge from "@mui/utils/deepmerge";
import { ErrorBoundary } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContextProvider from "src/AuthContextProvider";
import ErrorPage from "src/pages/ErrorPage";
import Router from "src/Router";
import lexiconThemeOptions from "src/themeOptions";

const queryClient = new QueryClient();
const theme = createTheme(deepmerge(defaultThemeOptions, lexiconThemeOptions));

function App() {
  return (
    <ThemeProvider theme={theme}>
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

export default App;
