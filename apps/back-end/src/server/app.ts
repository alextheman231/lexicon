import cookieParser from "cookie-parser";
import express from "express";

import { handleErrors } from "src/server/errors";
import createEndpoints from "src/server/routes";
import ALLOWED_ORIGINS from "src/utility/constants/ALLOWED_ORIGINS";
import setupCors from "src/utility/setupCors";

const app = express();

app.use(setupCors(ALLOWED_ORIGINS));
app.use(express.json());
app.use(cookieParser());

createEndpoints(app);
handleErrors(app);

export default app;
