import type { CodeError } from "@alextheman/utility/v6";

import { DataError } from "@alextheman/utility/v6";

export type CodeErrorFormatter =
  string | ((error: CodeError | DataError, status?: number) => string);
export type CodeErrorMap = Record<string, CodeErrorFormatter>;

const defaultErrorFormatters: CodeErrorMap = {
  RESOURCE_NOT_FOUND: (error) => {
    if (DataError.checkWithCode(error, "RESOURCE_NOT_FOUND")) {
      const resourceType = error.data.resourceType ?? "resource";
      return `The ${resourceType} you are looking for does not seem to exist.`;
    }
    return "The resource you are looking for does not seem to exist.";
  },
};

export default defaultErrorFormatters;
