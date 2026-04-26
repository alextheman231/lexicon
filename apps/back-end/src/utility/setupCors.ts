import { DataError } from "@alextheman/utility/v6";
import cors from "cors";

function setupCors(allowedOrigins: Array<string>) {
  return cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new DataError({ origin }, "CORS_ERROR", "This URL is not supported by CORS policy."),
        false,
      );
    },
    credentials: true,
  });
}

export default setupCors;
