import { ModeProvider, SnackbarProvider } from "@alextheman/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import AuthContextProvider from "src/AuthContextProvider";
import ErrorPage from "src/pages/ErrorPage";
import Router from "src/Router";

const queryClient = new QueryClient();

function App() {
  // eslint-disable-next-line no-console
  console.log(import.meta.env.VITE_API_BASE_URL);

  return (
    <ModeProvider>
      <ErrorBoundary FallbackComponent={ErrorPage}>
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
