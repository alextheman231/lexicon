import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import Alert from "@mui/material/Alert";

import formatError from "src/utility/errors/formatError";

interface ErrorMessageProps {
  error: unknown;
  codeErrorMap?: CodeErrorMap;
  errorFunction?: (error: unknown) => string;
}

function ErrorMessage({ error, codeErrorMap, errorFunction }: ErrorMessageProps) {
  return <Alert severity="error">{formatError(error, codeErrorMap, errorFunction)}</Alert>;
}

export default ErrorMessage;
