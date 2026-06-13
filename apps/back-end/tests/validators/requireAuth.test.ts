import { parseUser } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("requireAuth", () => {
  test("Protects an endpoint if no auth present", async () => {
    const { body } = await testClient.get("/api/v1/protected").expect(401);
    expect(body.error.code).toBe("AUTH_REQUIRED");
  });
  test("Allows the endpoint logic to run if auth present", async () => {
    const { factory } = await getTestFixtures();

    const user = await factory.users.insert();
    const session = await factory.userSessions.insert({ user });

    const { body } = await testClient
      .get("/api/v1/protected")
      .set("Cookie", [`session=${session.id}`])
      .expect(200);
    const signedInUser = parseUser(body.user);

    expect(signedInUser).toMatchObject(user);
  });
});
