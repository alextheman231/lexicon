import type { CodeErrorMap } from "src/utility/errors/errorFormatters";

import { CodeError } from "@alextheman/utility/v6";
import axios from "axios";

import DEFAULT_ERROR_MESSAGE from "src/utility/errors/DEFAULT_ERROR_MESSAGE";
import defaultErrorFormatters from "src/utility/errors/errorFormatters";

function resolveErrorFromCode(error: CodeError, errorFormatters: CodeErrorMap, status?: number) {
  if (error.code in errorFormatters) {
    const defaultMessageForCode = errorFormatters[error.code];
    if (typeof defaultMessageForCode === "function") {
      return defaultMessageForCode(error, status);
    }
    return defaultMessageForCode;
  }
  return error.message ?? DEFAULT_ERROR_MESSAGE;
}

function resolveError(
  error: unknown,
  codeErrorMap: CodeErrorMap,
  errorFunction?: (error: unknown) => string,
): string {
  if (CodeError.check(error)) {
    return resolveErrorFromCode(error, codeErrorMap);
  }

  if (errorFunction) {
    return errorFunction(error);
  }

  return DEFAULT_ERROR_MESSAGE;
}

function formatError(
  error: unknown,
  codeErrorMap: CodeErrorMap = defaultErrorFormatters,
  errorFunction?: (error: unknown) => string,
): string {
  if (axios.isAxiosError(error)) {
    const apiError =
      error.response?.data && typeof error.response.data === "object"
        ? error.response.data?.error
        : undefined;

    if (CodeError.check(apiError)) {
      return resolveErrorFromCode(apiError, codeErrorMap, error.response?.status);
    }
    return resolveError(error, codeErrorMap, errorFunction);
  }
  return resolveError(error, codeErrorMap, errorFunction);
}

export default formatError;
