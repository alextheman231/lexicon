import { addDaysToDate, omitProperties } from "@alextheman/utility";
import { parseUserProfile } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/current-user", () => {
  test("Get the currently signed in user", async () => {
    const fixtures = new TestFixtures();

    const testClient = await fixtures.authenticatedClient;
    const user = await fixtures.authenticatedUser;

    const { body } = await testClient.get("/api/v1/current-user").expect(200);
    const signedInUser = parseUserProfile(body.user);

    expect(signedInUser).toMatchObject(
      omitProperties(user, [
        "email",
        "dateOfBirth",
        "profilePictureFileKey",
        "profilePictureFileName",
      ]),
    );
  });
  test("If there is currently no session, return a null user", async () => {
    const { body } = await testClient.get("/api/v1/current-user").expect(200);
    expect(body.user).toBeNull();
  });
  test("If session is expired, return null user", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const session = await factory.userSessions.insert({
      user,
      expiresAt: addDaysToDate(new Date(), -1),
    });

    const { body } = await testClient
      .get("/api/v1/current-user")
      .set("Cookie", [`session=${session.id}`])
      .expect(200);
    expect(body.user).toBeNull();
  });
  test("If session does not exist, return null user", async () => {
    const { body } = await testClient
      .get("/api/v1/current-user")
      .set("Cookie", [`session=${randomUUID()}`])
      .expect(200);

    expect(body.user).toBeNull();
  });
});
