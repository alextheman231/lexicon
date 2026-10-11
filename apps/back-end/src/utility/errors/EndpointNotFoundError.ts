import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

export interface EndpointNotFoundErrorPayload {
  endpoint: string;
}

class EndpointNotFoundError extends DataError<EndpointNotFoundErrorPayload, "ENDPOINT_NOT_FOUND"> {
  public constructor(data: EndpointNotFoundErrorPayload, options?: ErrorOptions) {
    super(data, "ENDPOINT_NOT_FOUND", "Could not find the requested endpoint", options);
  }

  public override toAPIError(): APIError<EndpointNotFoundErrorPayload, "ENDPOINT_NOT_FOUND"> {
    return new APIError(404, this.code, this.message, this.data);
  }
}

export default EndpointNotFoundError;
