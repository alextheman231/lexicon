import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "src/index.css";
import { ErrorBoundary } from "react-error-boundary";

import App from "src/App";
import ErrorPage from "src/pages/ErrorPage";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>,
);
