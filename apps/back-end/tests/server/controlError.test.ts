import { CodeError } from "@alextheman/utility/v6";
import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "src/server/app";

describe("/api/v1/control/be-error", () => {
  test("Should throw an internal server error", async () => {
    const { body } = await request(app).get("/api/v1/control/be-error").expect(500);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
