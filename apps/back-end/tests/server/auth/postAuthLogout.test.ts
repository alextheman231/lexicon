import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";

describe("POST /api/v1/auth/logout", () => {
  test("Signs out the currently signed-in user", async () => {
    const { authenticatedClient } = await getTestFixtures();

    await authenticatedClient.post("/api/v1/auth/logout").expect(204);

    const { body } = await authenticatedClient.get("/api/v1/current-user").expect(200);
    expect(body.user).toBeNull();
  });
});
