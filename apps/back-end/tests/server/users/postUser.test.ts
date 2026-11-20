import type { CreateUserData } from "@lexicon/models";

import { assertNotNull, az, isSameDate } from "@alextheman/utility";
import { CodeError } from "@alextheman/utility/v6";
import { EmailIdent, UserState } from "@lexicon/models";
import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import z from "zod";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import { emailsTable } from "src/database/schema";
import selectUser from "src/models/users/selectUser";
import selectUserStateHistory from "src/models/users/selectUserStateHistory";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

describe("POST /api/v1/users", () => {
  test("Posts a user to the database", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;

    const data: CreateUserData = {
      username: "test_user",
      displayName: "Test user",
      description: "I am a user",
      email: "test@example.com",
      dateOfBirth: new Date("2003-07-15T00:00:00.000Z"),
    };

    const {
      body: { id },
    } = await testClient.post("/api/v1/users").send(data).expect(201);
    const userId = az.with(z.uuid()).parse(id);

    const user = await selectUser(connection, { userId });
    assertNotNull(user);
    expect(user.username).toBe(data.username);
    expect(user.displayName).toBe(data.displayName);
    expect(user.description).toBe(data.description);
    expect(user.email).toBe(data.email);
    expect(user.state).toBe(UserState.UNVERIFIED);
    assertNotNull(user.dateOfBirth);
    expect(isSameDate(new Date(user.dateOfBirth), data.dateOfBirth)).toBe(true);

    const stateHistory = await selectUserStateHistory(connection, user.id);
    expect(stateHistory.length).toBe(1);

    const [historyRow] = stateHistory;

    expect(historyRow.state).toBe(user.state);
    expect(historyRow.userId).toBe(user.id);
    expect(historyRow.updatedById).toBeNull();
    expect(isSameDate(historyRow.updatedAt, new Date())).toBe(true);
  });
  test("Inserts an email to be sent, prompting the user to reset their password", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;

    const data: CreateUserData = {
      username: "test_user",
      displayName: "Test user",
      description: "I am a user",
      email: "test@example.com",
      dateOfBirth: new Date("2003-07-15T00:00:00.000Z"),
    };

    const {
      body: { id },
    } = await testClient.post("/api/v1/users").send(data).expect(201);
    const userId = az.with(z.uuid()).parse(id);

    const user = await selectUser(connection, { userId });
    assertNotNull(user);
    const email = await fetchSole(
      connection.select().from(emailsTable).where(eq(emailsTable.recipientId, userId)),
    );
    assertNotNull(email);
    const context = az
      .with(
        z.object({
          username: z.string(),
        }),
      )
      .parse(email.context);

    expect(email.recipientId).toBe(userId);
    expect(email.ident).toBe(EmailIdent.COMPLETE_SIGN_UP);
    expect(email.sentAt).toBeNull();
    expect(context.username).toBe(user.displayName ?? user.username);
  });
  test("Rejects users less than 13 years old", async () => {
    const today = new Date();

    const data: CreateUserData = {
      username: "test_user",
      displayName: "Test user",
      description: "I am a user",
      email: "test@example.com",
      dateOfBirth: new Date(`${today.getFullYear() - 11}-07-15T00:00:00.000Z`),
    };

    const { body } = await testClient.post("/api/v1/users").send(data).expect(400);

    const error = CodeError.expectError<LexiconErrorCode>(() => {
      throw body.error;
    });

    expect(error.code).toBe(LexiconErrorCode.INVALID_AGE);
  });
});
