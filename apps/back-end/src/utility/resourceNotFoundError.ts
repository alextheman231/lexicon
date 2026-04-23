import { DataError } from "@alextheman/utility/v6";

export interface ResourceNotFoundErrorPayload {
  statusCode: 404;
  resourceType: string;
  resourceId: string;
}

function resourceNotFoundError(
  resourceType: string,
  resourceId: string,
): DataError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND"> {
  return new DataError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND">(
    { statusCode: 404, resourceType, resourceId },
    "RESOURCE_NOT_FOUND",
    `Could not find ${resourceType.toLowerCase()} in database.`,
  );
}

export default resourceNotFoundError;
