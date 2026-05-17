import { useBackendErrorQuery } from "src/queries";

function BackendError() {
  useBackendErrorQuery();

  return null;
}

export default BackendError;
