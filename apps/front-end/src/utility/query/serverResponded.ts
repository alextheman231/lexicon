import axios from "axios";

function serverResponded(error: unknown) {
  return axios.isAxiosError(error) && error.response !== undefined;
}

export default serverResponded;
