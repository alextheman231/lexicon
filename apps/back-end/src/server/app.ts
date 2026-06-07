import cookieParser from "cookie-parser";
import express from "express";

import { resolveErrors } from "src/server/errors";
import createEndpoints from "src/server/routes";
import ALLOWED_ORIGINS from "src/utility/constants/ALLOWED_ORIGINS";
import setupCors from "src/utility/initialisers/setupCors";
import "src/instrument";

const app = express();

app.use(express.json());

app.use(setupCors(ALLOWED_ORIGINS));
app.use(express.json());
app.use(cookieParser());

createEndpoints(app);
resolveErrors(app);

export default app;
