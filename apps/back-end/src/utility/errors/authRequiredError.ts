import { APIError } from "@alextheman/utility/v6";

export interface AuthRequiredErrorPayload {
  sessionId?: unknown;
}

function authRequiredError(
  sessionId?: unknown,
): APIError<AuthRequiredErrorPayload, "AUTH_REQUIRED"> {
  return new APIError<AuthRequiredErrorPayload, "AUTH_REQUIRED">(
    401,
    "AUTH_REQUIRED",
    "Authentication is required to access this resource.",
    {
      sessionId,
    },
  );
}

export default authRequiredError;
