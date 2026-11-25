import type { ResetPasswordData } from "@lexicon/models";

import type { TokenExpiredErrorPayload } from "src/services/auth/errors/TokenExpiredError";
import type { ResourceNotFoundErrorPayload } from "src/utility/errors/ResourceNotFoundError";

import { assertNotNull, wait } from "@alextheman/utility";
import { CodeError, DataError } from "@alextheman/utility/v6";
import { verify } from "argon2";
import { SignJWT } from "jose";
import { describe, expect, test } from "vitest";

import { randomBytes, randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import { TokenPurpose } from "src/models/auth/TokenPurpose";
import selectUser from "src/models/users/selectUser";
import generateToken from "src/services/auth/generateToken";
import { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

describe("PUT /api/v1/auth/complete-sign-up", () => {
  test("Successfully resets the user's password and verifies the user", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const token = await generateToken(user.id, "complete-sign-up");

    const data: ResetPasswordData = {
      token,
      password: randomBytes(6).toString("hex"),
    };

    await testClient.put("/api/v1/auth/complete-sign-up").send(data).expect(200);
    const updatedUser = await selectUser(connection, { userId: user.id });
    assertNotNull(updatedUser);
    assertNotNull(updatedUser.passwordHash);

    expect(await verify(updatedUser.passwordHash, data.password)).toBe(true);
  });
  test("Fails with status code 400 on a weak password", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const token = await generateToken(user.id, "complete-sign-up");

    const data: ResetPasswordData = {
      token,
      password: "password",
    };

    const { body } = await testClient.put("/api/v1/auth/complete-sign-up").send(data).expect(400);

    const error = CodeError.expectError<LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.WEAK_PASSWORD);
  });
  test("Fails with status code 404 if the user does not exist", async () => {
    const missingId = randomUUID();
    const token = await generateToken(missingId, "complete-sign-up");

    const data: ResetPasswordData = {
      token,
      password: randomBytes(6).toString("hex"),
    };

    const { body } = await testClient.put("/api/v1/auth/complete-sign-up").send(data).expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload, LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.RESOURCE_NOT_FOUND);
    expect(error.data.resourceType).toBe("user");
    expect(error.data.resourceId).toBe(missingId);
  });
  test("Fails for an expired token", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();

    const secret = new TextEncoder().encode(process.env.LEXICON_SECRET_KEY);
    const token = await new SignJWT({ purpose: TokenPurpose.COMPLETE_SIGN_UP })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("1s")
      .setIssuer("lexicon")
      .setAudience(TokenPurpose.COMPLETE_SIGN_UP)
      .sign(secret);

    await wait(2);

    const data: ResetPasswordData = {
      token,
      password: randomBytes(6).toString("hex"),
    };

    const { body } = await testClient.put("/api/v1/auth/complete-sign-up").send(data).expect(400);

    const error = DataError.expectError<TokenExpiredErrorPayload, LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.TOKEN_EXPIRED);
    expect(error.data.payload.sub).toBe(user.id);
    expect(error.data.payload.purpose).toBe(TokenPurpose.COMPLETE_SIGN_UP);
  });
  test("Fails for an invalid token", async () => {
    const token = "invalid";

    const data: ResetPasswordData = {
      token,
      password: randomBytes(6).toString("hex"),
    };

    const { body } = await testClient.put("/api/v1/auth/complete-sign-up").send(data).expect(400);

    const error = DataError.expectError<TokenExpiredErrorPayload, LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.INVALID_TOKEN);
  });
});
