import { parseIntStrict } from "@alextheman/utility";

import app from "src/server/app";

const PORT = parseIntStrict(process.env.PORT ?? "8080");

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else if (process.env.API_BASE_URL) {
    console.info(`Listening for requests at ${process.env.API_BASE_URL}`);
  } else {
    console.info(`Listening for requests on port ${PORT}`);
  }
});
