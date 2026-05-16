import { useEffect } from "react";

import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";

function BackendError() {
  useEffect(() => {
    (async () => {
      await lexiconAuthenticatedClient.get("/api/v1/control/be-error");
    })();
  }, []);

  return null;
}

export default BackendError;
