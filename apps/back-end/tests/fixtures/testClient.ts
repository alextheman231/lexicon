import request from "supertest";

import app from "src/server/app";

const testClient = request(app);

export default testClient;
