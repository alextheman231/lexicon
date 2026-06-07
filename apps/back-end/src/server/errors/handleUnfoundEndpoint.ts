import endpointNotFoundError from "src/utility/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";

const handleUnfoundEndpoint = handleFallthroughMiddleware(async (request) => {
  // If we ever get into this app.use, the endpoint does not exist
  throw endpointNotFoundError({ endpoint: request.path });
});

export default handleUnfoundEndpoint;
