import EndpointNotFoundError from "src/utility/errors/EndpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

const handleUnfoundEndpoint = handleFallthroughMiddleware(async (request) => {
  // If we ever get into this app.use, the endpoint does not exist
  throw new EndpointNotFoundError({ endpoint: request.path });
});

export default handleUnfoundEndpoint;
