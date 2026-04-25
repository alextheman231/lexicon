import { parseUser } from "@lexicon/models";
import request from "supertest";
import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";

import app from "src/server/app";

describe("PUT", () => {
  describe("/api/v1/current-user/profile", () => {
    test("Update the current user's profile details", async () => {
      const { factory } = getTestFixtures();
      const user = await factory.users.insert();
      const userSession = await factory.userSessions.insert({ user });

      await request(app)
        .put("/api/v1/current-user/profile")
        .send({
          username: "alex_man",
          displayName: "Alex Man",
          description: "I am a user on Lexicon",
        })
        .set("Cookie", [`session=${userSession.id}`])
        .expect(200);

      const { body } = await request(app)
        .get("/api/v1/auth/current-user")
        .set("Cookie", [`session=${userSession.id}`])
        .expect(200);

      const currentUser = parseUser(body.user);

      expect(currentUser.username).toBe("alex_man");
      expect(currentUser.displayName).toBe("Alex Man");
      expect(currentUser.description).toBe("I am a user on Lexicon");
    });
  });
});
