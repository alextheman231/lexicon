import { APIError } from "@alextheman/utility/v6";

interface EndpointNotFoundErrorPayload {
  endpoint: string;
}

function endpointNotFoundError(
  data: EndpointNotFoundErrorPayload,
): APIError<EndpointNotFoundErrorPayload, "ENDPOINT_NOT_FOUND"> {
  return new APIError(404, "ENDPOINT_NOT_FOUND", "Could not find the requested endpoint", data);
}

export default endpointNotFoundError;
