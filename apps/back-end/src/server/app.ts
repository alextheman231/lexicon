import cookieParser from "cookie-parser";
import express from "express";

import "src/instrument";
import { resolveErrors } from "src/server/errors";
import createEndpoints from "src/server/routes";
import loadAllowedOrigins from "src/utility/env/loadAllowedOrigins";
import setupCors from "src/utility/initialisers/setupCors";

const app = express();

app.use(express.json());

app.use(setupCors(loadAllowedOrigins()));
app.use(express.json());
app.use(cookieParser());

createEndpoints(app);
resolveErrors(app);

export default app;
