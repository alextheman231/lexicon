import { stringListToArray } from "@alextheman/utility";
import cookieParser from "cookie-parser";
import express from "express";

import "src/instrument";
import { resolveErrors } from "src/server/errors";
import createEndpoints from "src/server/routes";
import setupCors from "src/utility/initialisers/setupCors";

const app = express();

app.use(express.json());

app.use(setupCors(stringListToArray(process.env.ALLOWED_ORIGINS ?? "")));
app.use(express.json());
app.use(cookieParser());

createEndpoints(app);
resolveErrors(app);

export default app;
