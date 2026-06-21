import cookieParser from "cookie-parser";
import express from "express";

import "src/instrument";
import { resolveErrors } from "src/server/errors";
import createEndpoints from "src/server/routes";
import loadAllowedOrigins from "src/utility/env/loadAllowedOrigins";
import loadCurrentUser from "src/utility/handlers/loadCurrentUser";
import setupCors from "src/utility/initialisers/setupCors";

const app = express();

app.use(setupCors(loadAllowedOrigins()));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(loadCurrentUser);

createEndpoints(app);

app.get(/^\/(?!api).*/, (_request, response) => {
  response.sendFile("index.html", {
    root: "public",
  });
});

resolveErrors(app);

export default app;
