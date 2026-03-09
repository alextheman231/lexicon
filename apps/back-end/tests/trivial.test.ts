import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "src/server/app";

describe("Trivial test", () => {
  test("Trivial endpoint query", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(body.hello).toBe("world");
  });
});
