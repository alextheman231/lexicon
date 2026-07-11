import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("POST /api/v1/auth/logout", () => {
  test("Signs out the currently signed-in user", async () => {
    const fixtures = new TestFixtures();

    const testClient = await fixtures.authenticatedClient;

    await testClient.post("/api/v1/auth/logout").expect(204);

    const { body } = await testClient.get("/api/v1/current-user").expect(200);
    expect(body.user).toBeNull();
  });
});
