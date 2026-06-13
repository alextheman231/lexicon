import { addDaysToDate } from "@alextheman/utility";
import { parseUser } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/current-user", () => {
  test("Get the currently signed in user", async () => {
    const { authenticatedClient, authenticatedUser } = await getTestFixtures();

    const { body } = await authenticatedClient.get("/api/v1/current-user").expect(200);
    const signedInUser = parseUser(body.user);

    expect(signedInUser).toMatchObject(authenticatedUser);
  });
  test("If there is currently no session, return a null user", async () => {
    const { body } = await testClient.get("/api/v1/current-user").expect(200);
    expect(body.user).toBeNull();
  });
  test("If session is expired, return null user", async () => {
    const { factory } = await getTestFixtures();

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
