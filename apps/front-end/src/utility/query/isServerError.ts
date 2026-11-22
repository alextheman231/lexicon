import { isAxiosError } from "axios";

function isServerError(error: unknown): boolean {
  return isAxiosError(error) && (error.response?.status ?? 0) >= 500;
}

export default isServerError;
