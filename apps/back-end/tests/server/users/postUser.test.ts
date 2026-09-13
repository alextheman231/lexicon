import type { CreateUserData } from "@lexicon/models";

import { assertNotNull, az, isSameDate } from "@alextheman/utility";
import { UserState } from "@lexicon/models";
import { describe, expect, test } from "vitest";
import z from "zod";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import selectUser from "src/models/users/selectUser";
import selectUserStateHistory from "src/models/users/selectUserStateHistory";

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
});
