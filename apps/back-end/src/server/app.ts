import { stringListToArray } from "@alextheman/utility";
import express from "express";

import createEndpoints from "src/server/routes";
import setupCors from "src/utility/setupCors";

const app = express();

app.use(setupCors(stringListToArray(process.env.ALLOWED_ORIGINS ?? "")));
app.use(express.json());

createEndpoints(app);

export default app;
