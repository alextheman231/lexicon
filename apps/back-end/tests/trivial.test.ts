import { describe, expect, test } from "vitest";

import testClient from "tests/fixtures/testClient";

describe("Trivial test", () => {
  test("Trivial endpoint query", async () => {
    const { body } = await testClient.get("/api/v1").expect(200);
    expect(body.hello).toBe("world");
  });
});
