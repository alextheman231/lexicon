import axios from "axios";

const lexiconAuthenticatedClient = axios.create({
  withCredentials: true,
});

export default lexiconAuthenticatedClient;
