import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContextProvider from "src/AuthContextProvider";
import Editor from "src/components/Editor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Editor />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
