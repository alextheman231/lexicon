import { ErrorBoundary, init } from "@sentry/react";
import { StrictMode } from "react";

import "src/index.css";

import { createRoot } from "react-dom/client";

import App from "src/App";
import ErrorPage from "src/pages/ErrorPage";

// eslint-disable-next-line no-console -- Temporary console.log so I can see if VITE_SENTRY_DSN is actually being used in production
console.log(import.meta.env.VITE_SENTRY_DSN);
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    environment: import.meta.env.MODE,
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={ErrorPage}>
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>,
);
