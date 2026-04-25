import { addDaysToDate } from "@alextheman/utility";
import { parseUser } from "@lexicon/models";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

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
        .get("/api/v1/current-user")
        .set("Cookie", [`session=${userSession.id}`])
        .expect(200);

      const currentUser = parseUser(body.user);

      expect(currentUser.username).toBe("alex_man");
      expect(currentUser.displayName).toBe("Alex Man");
      expect(currentUser.description).toBe("I am a user on Lexicon");
    });
  });
});

describe("GET", () => {
  describe("/api/v1/current-user", () => {
    test("Get the currently signed in user", async () => {
      const { factory } = getTestFixtures();
      const user = await factory.users.insert();
      const userSession = await factory.userSessions.insert({ user });

      const { body } = await request(app)
        .get("/api/v1/current-user")
        .set("Cookie", [`session=${userSession.id}`])
        .expect(200);
      const signedInUser = parseUser(body.user);

      expect(signedInUser).toMatchObject(user);
    });
    test("If there is currently no session, return a null user", async () => {
      const { body } = await request(app).get("/api/v1/current-user").expect(200);
      expect(body.user).toBeNull();
    });
    test("If session is expired, return null user", async () => {
      const { factory } = getTestFixtures();

      const user = await factory.users.insert();

      const session = await factory.userSessions.insert({
        user,
        expiresAt: addDaysToDate(new Date(), -1),
      });

      const { body } = await request(app)
        .get("/api/v1/current-user")
        .set("Cookie", [`session=${session.id}`])
        .expect(200);
      expect(body.user).toBeNull();
    });
    test("If session does not exist, return null user", async () => {
      const { body } = await request(app)
        .get("/api/v1/current-user")
        .set("Cookie", [`session=${randomUUID()}`])
        .expect(200);

      expect(body.user).toBeNull();
    });
  });
});
