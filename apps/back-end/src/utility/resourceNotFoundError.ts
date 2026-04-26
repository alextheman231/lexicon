import { APIError } from "@alextheman/utility/v6";

export interface ResourceNotFoundErrorPayload {
  resourceType: string;
  resourceId: string;
}

function resourceNotFoundError(
  resourceType: string,
  resourceId: string,
): APIError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND"> {
  return new APIError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND">(
    404,
    "RESOURCE_NOT_FOUND",
    `Could not find ${resourceType.toLowerCase()} in database.`,
    { resourceType, resourceId },
  );
}

export default resourceNotFoundError;
