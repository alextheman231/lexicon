import { DataError } from "@alextheman/utility/v6";
import { parseUser } from "@lexicon/models";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import app from "src/server/app";

describe("GET", () => {
  describe("/api/v1/users/:userId", () => {
    test("Should get the user with the given ID", async () => {
      const { factory } = getTestFixtures();
      const user = await factory.users.insert();

      const { body } = await request(app).get(`/api/v1/users/${user.id}`).expect(200);
      const userPayload = parseUser(body.user);

      expect(userPayload).toMatchObject(user);
    });
    test("Should fail with 404 if the ID is not found", async () => {
      const missingId = randomUUID();

      const { body } = await request(app).get(`/api/v1/users/${missingId}`).expect(404);

      const error = DataError.expectError(() => {
        throw body.error;
      });

      expect(error.code).toBe("RESOURCE_NOT_FOUND");
      expect(error.data.statusCode).toBe(404);
      expect(error.data.resourceType).toBe("user");
      expect(error.data.resourceId).toBe(missingId);
    });
    test("Should fail with 400 if not a valid UUID", async () => {
      const { body } = await request(app).get(`/api/v1/users/hello`).expect(400);
      expect(body.error.id).toBe("hello");
    });
  });
});
