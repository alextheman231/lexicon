import { APIError } from "@alextheman/utility/v6";

export interface ForbiddenAccessErrorData {
  userId?: string;
}

function forbiddenAccessError({ userId }: ForbiddenAccessErrorData) {
  return new APIError(
    403,
    "FORBIDDEN_ACCESS",
    "You do not have permission to access this resource.",
    { userId },
  );
}

export default forbiddenAccessError;
