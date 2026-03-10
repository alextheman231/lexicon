import { DataError } from "@alextheman/utility";

function resourceNotFoundError(resourceType: string, resourceId: string): DataError {
  return new DataError(
    { statusCode: 404, resourceType, resourceId },
    "RESOURCE_NOT_FOUND",
    `Could not find ${resourceType.toLowerCase()} in database.`,
  );
}

export default resourceNotFoundError;
