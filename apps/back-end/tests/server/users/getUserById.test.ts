import { omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseUserProfile } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/users/<userId>", () => {
  test("Should get the user with the given ID", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();

    const { body } = await testClient.get(`/api/v1/users/${user.id}`).expect(200);
    const userPayload = parseUserProfile(body.user);

    expect(userPayload).toMatchObject(
      omitProperties(user, [
        "email",
        "dateOfBirth",
        "profilePictureFileKey",
        "profilePictureFileName",
      ]),
    );
  });
  test("Should fail with 404 if the ID is not found", async () => {
    const missingId = randomUUID();

    const { body } = await testClient.get(`/api/v1/users/${missingId}`).expect(404);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceType).toBe("user");
    expect(error.data.resourceId).toBe(missingId);
  });
  test("Should fail with 404 if not a valid UUID", async () => {
    const { body } = await testClient.get(`/api/v1/users/hello`).expect(404);
    const error = DataError.expectError(() => {
      throw body.error;
    });
    expect(error.code).toBe("ENDPOINT_NOT_FOUND");
    expect(error.data.endpoint).toBe("/api/v1/users/hello");
  });
});
