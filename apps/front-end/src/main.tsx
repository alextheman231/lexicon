import { ErrorBoundary, init } from "@sentry/react";
import { StrictMode } from "react";

import "src/index.css";

import { createRoot } from "react-dom/client";

import App from "src/App";
import ErrorPage from "src/pages/ErrorPage";

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={ErrorPage}>
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>,
);
