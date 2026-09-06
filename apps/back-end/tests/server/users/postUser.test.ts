import type { CreateUserData } from "@lexicon/models";

import { assertNotNull, az, isSameDate } from "@alextheman/utility";
import { describe, expect, test } from "vitest";
import z from "zod";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import selectUser from "src/models/users/selectUser";

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
    assertNotNull(user.dateOfBirth);
    expect(isSameDate(new Date(user.dateOfBirth), data.dateOfBirth)).toBe(true);
  });
});
