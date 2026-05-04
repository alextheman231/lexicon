import type { FallbackProps } from "react-error-boundary";

import { ErrorPage as AlexErrorPage, InternalLink } from "@alextheman/components/v7";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Debug from "src/components/Debug";
import { DEFAULT_ERROR_MESSAGE } from "src/utility/errors/DEFAULT_ERROR_MESSAGE";
import formatError from "src/utility/errors/formatError";

function ErrorPage({ error }: FallbackProps) {
  const message = formatError(error);

  return (
    <AlexErrorPage title={DEFAULT_ERROR_MESSAGE}>
      {message === DEFAULT_ERROR_MESSAGE ? null : message}
      {import.meta.env.DEV && error instanceof Error && error.stack ? (
        <Debug content={error.stack} disableJsonStringify />
      ) : null}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button component={InternalLink} to="/">
          Return to homepage
        </Button>
      </Box>
    </AlexErrorPage>
  );
}

export default ErrorPage;
