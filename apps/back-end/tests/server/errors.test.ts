import type { EndpointNotFoundErrorPayload } from "src/utility/errors/EndpointNotFoundError";

import { describe, expect, test } from "vitest";

import testClient from "tests/fixtures/testClient";

import CodeError from "src/utility/errors/CodeError";
import DataError from "src/utility/errors/DataError";

describe("/api/v1/control/be-error", () => {
  test("Should throw an internal server error", async () => {
    const { body } = await testClient.get("/api/v1/control/be-error").expect(500);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
  });
});

describe("*", () => {
  test("Throws a 404 error if the endpoint is not found", async () => {
    const { body } = await testClient.get("/api/v1/invalid").expect(404);

    const error = DataError.expectError<EndpointNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("ENDPOINT_NOT_FOUND");
    expect(error.data.endpoint).toBe("/api/v1/invalid");
  });
});
