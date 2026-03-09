import { parseIntStrict } from "@alextheman/utility";

import app from "src/server/app";

const PORT = parseIntStrict(process.env.PORT ?? "8080");

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`Listening on port ${PORT}`);
  }
});
