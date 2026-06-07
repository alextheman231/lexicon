import { parseUser } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";

describe("PUT /api/v1/current-user/profile", () => {
  test("Update the current user's profile details", async () => {
    const { authenticatedClient } = await getTestFixtures();

    await authenticatedClient
      .put("/api/v1/current-user/profile")
      .send({
        username: "alex_man",
        displayName: "Alex Man",
        description: "I am a user on Lexicon",
      })
      .expect(200);

    const { body } = await authenticatedClient.get("/api/v1/current-user").expect(200);

    const currentUser = parseUser(body.user);

    expect(currentUser.username).toBe("alex_man");
    expect(currentUser.displayName).toBe("Alex Man");
    expect(currentUser.description).toBe("I am a user on Lexicon");
  });
});
