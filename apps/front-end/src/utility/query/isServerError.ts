import axios from "axios";

function isServerError(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status ?? 0) >= 500;
}

export default isServerError;
