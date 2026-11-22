import { create } from "axios";

const lexiconAuthenticatedClient = create({
  withCredentials: true,
});

export default lexiconAuthenticatedClient;
