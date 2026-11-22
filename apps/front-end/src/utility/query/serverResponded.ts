import { isAxiosError } from "axios";

function serverResponded(error: unknown) {
  return isAxiosError(error) && error.response !== undefined;
}

export default serverResponded;
