import { parseUser } from "@lexicon/models";
import request from "supertest";
import { describe, expect, test } from "vitest";

import TestFactory from "tests/factory";

import connection from "src/database/connection";
import app from "src/server/app";

describe("GET", () => {
  describe("/api/users/:userId", () => {
    test("Should get all users", async () => {
      const factory = TestFactory.create(connection);
      const factoryUser = await factory.users.insert();

      const { body } = await request(app).get(`/api/users/${factoryUser.id}`).expect(200);
      const { payload } = body;
      const user = parseUser(payload);

      expect(user).toMatchObject(factoryUser);
    });
  });
});
