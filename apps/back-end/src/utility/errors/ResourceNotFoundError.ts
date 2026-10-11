import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

export interface ResourceNotFoundErrorPayload {
  resourceType: string;
  resourceId?: string;
}

class ResourceNotFoundError extends DataError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND"> {
  public constructor(data: ResourceNotFoundErrorPayload, options?: ErrorOptions) {
    super(
      data,
      "RESOURCE_NOT_FOUND",
      `Could not find ${data.resourceType.toLowerCase()} in database.`,
      options,
    );
  }

  public override toAPIError(): APIError<ResourceNotFoundErrorPayload, "RESOURCE_NOT_FOUND"> {
    return new APIError(404, this.code, this.message, this.data);
  }
}

export default ResourceNotFoundError;
