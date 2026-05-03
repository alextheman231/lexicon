import { ModeProvider, SnackbarProvider } from "@alextheman/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContextProvider from "src/AuthContextProvider";
import Router from "src/Router";

const queryClient = new QueryClient();

function App() {
  return (
    <ModeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <SnackbarProvider>
            <Router />
          </SnackbarProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ModeProvider>
  );
}

export default App;
