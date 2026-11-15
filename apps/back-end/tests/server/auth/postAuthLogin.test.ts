import type { SignInData } from "@lexicon/models";

import {
  addDaysToDate,
  assertNotNull,
  assertNotUndefined,
  isSameDate,
  UUID_REGEX_PATTERN,
} from "@alextheman/utility";
import { CodeError } from "@alextheman/utility/v6";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";
import getSetCookies from "tests/server/auth/helpers/getSetCookies";

import selectUserSession from "src/models/userSessions/selectUserSession";
import hashPassword from "src/services/auth/hashPassword";
import { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

describe("POST /api/v1/auth/login", () => {
  test("Logs the user in and sets the cookies.", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const password = "password";
    const passwordHash = await hashPassword(password);

    const user = await factory.users.insert({ passwordHash });

    const data: SignInData = {
      email: user.email,
      password,
    };

    const { headers } = await testClient.post("/api/v1/auth/login").send(data).expect(200);
    const cookies = getSetCookies(headers);

    expect(cookies.length).toBe(1);
    const [cookie] = cookies;

    expect(cookie.startsWith("session=") && cookie.includes("HttpOnly")).toBe(true);

    const matches = RegExp(`^session=(?<sessionId>${UUID_REGEX_PATTERN})`).exec(cookie);
    assertNotNull(matches);
    assertNotUndefined(matches.groups);

    const { sessionId } = matches.groups;

    const session = await selectUserSession(connection, sessionId);
    assertNotNull(session);

    const today = new Date();
    expect(session.userId).toBe(user.id);
    expect(isSameDate(session.createdAt, today)).toBe(true);
    expect(isSameDate(session.expiresAt, addDaysToDate(today, 7))).toBe(true);
  });
  test("Rejects an incorrect password.", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const password = "password";
    const passwordHash = await hashPassword(password);

    const user = await factory.users.insert({ passwordHash });

    const data: SignInData = {
      email: user.email,
      password: "incorrect",
    };

    const { body } = await testClient.post("/api/v1/auth/login").send(data).expect(400);

    const error = CodeError.expectError<LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.INVALID_CREDENTIALS);
  });
  test("Does not return 404 if the user doesn't exist. Instead returns 400 with INVALID_CREDENTIALS.", async () => {
    const data: SignInData = {
      email: "test@test.com",
      password: "password",
    };

    const { body } = await testClient.post("/api/v1/auth/login").send(data).expect(400);

    const error = CodeError.expectError<LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.INVALID_CREDENTIALS);
  });
  test("Returns 400 with INVALID_CREDENTIALS if user exists but has no password hash set.", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert({ passwordHash: null });

    const data: SignInData = {
      email: user.email,
      password: "password",
    };

    const { body } = await testClient.post("/api/v1/auth/login").send(data).expect(400);

    const error = CodeError.expectError<LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.INVALID_CREDENTIALS);
  });
});
