import { parseUser } from "@lexicon/models";
import { eq } from "drizzle-orm";
// eslint-disable-next-line @alextheman/no-namespace-imports
import * as OpenIDClient from "openid-client";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import getTestFixtures from "tests/fixtures";

import { usersTable } from "src/database/schema";
import app from "src/server/app";
import { selectUser } from "src/services/users";

vi.mock("openid-client", async () => {
  return {
    authorizationCodeGrant: vi.fn(),
    buildAuthorizationUrl: vi.fn(),
    calculatePKCECodeChallenge: vi.fn(),
    randomPKCECodeVerifier: vi.fn(),
    randomState: vi.fn(),
    discovery: vi.fn(),
  };
});

const COOKIES = ["oauth_state=valid-state", "oauth_pkce_verifier=test-verifier"];

function getSetCookies(headers: any): Array<string> {
  const raw = headers["set-cookie"];
  if (!raw) {
    return [];
  }
  return Array.isArray(raw) ? raw : [raw];
}

describe("GET", () => {
  describe("/api/v1/auth/google/callback", () => {
    test("On successful response from Google, create the user and insert into the database", async () => {
      const { connection } = getTestFixtures();
      const initialUser = await connection
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, "test@example.com"));
      expect(initialUser.length).toBe(0);

      vi.spyOn(OpenIDClient, "authorizationCodeGrant").mockResolvedValue({
        claims: () => {
          return {
            sub: "google-user-123",
            email: "test@example.com",
            name: "Test User",
          } as unknown as OpenIDClient.IDToken;
        },
        access_token: "token",
        token_type: "Bearer",
      } as any);

      const { body, headers } = await request(app)
        .get("/api/v1/auth/google/callback")
        .query({ code: "test-code", state: "valid-state" })
        .set("Cookie", COOKIES)
        .expect(200);
      const user = parseUser(body.user);

      const cookies = getSetCookies(headers);
      expect(
        cookies.some((cookie: string) => {
          return cookie.startsWith("session=") && cookie.includes("HttpOnly");
        }),
      ).toBe(true);
      expect(user.email).toBe("test@example.com");
      expect(user.username).toContain("test");
      expect(user.username).not.toContain("@example.com");

      const databaseUser = parseUser(await selectUser(connection, user.id));
      expect(user).toMatchObject(databaseUser);
    });

    test("If auth provider and user already exists in database, use the existing details", async () => {
      const { connection, factory } = getTestFixtures();

      const factoryUser = await factory.users.insert();
      const factoryAuthProvider = await factory.authProviders.insert({ user: factoryUser });

      vi.spyOn(OpenIDClient, "authorizationCodeGrant").mockResolvedValue({
        claims: () => {
          return {
            sub: factoryAuthProvider.providerUserId,
            email: factoryUser.email,
            name: factoryUser.displayName,
          } as unknown as OpenIDClient.IDToken;
        },
        access_token: "token",
        token_type: "Bearer",
      } as any);

      const { body, headers } = await request(app)
        .get("/api/v1/auth/google/callback")
        .query({ code: "test-code", state: "valid-state" })
        .set("Cookie", COOKIES)
        .expect(200);
      const user = parseUser(body.user);

      const cookies = getSetCookies(headers);
      expect(
        cookies.some((cookie: string) => {
          return cookie.startsWith("session=") && cookie.includes("HttpOnly");
        }),
      ).toBe(true);
      expect(user).toMatchObject(factoryUser);

      const users = await connection
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, factoryUser.email));

      expect(users.length).toBe(1);
    });
  });
});
