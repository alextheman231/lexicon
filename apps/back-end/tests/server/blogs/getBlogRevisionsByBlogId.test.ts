import { assertNotUndefined, az, fillArray } from "@alextheman/utility";
import { CodeError, DataError } from "@alextheman/utility/v6";
import { parseBlogRevisionHistory } from "@lexicon/models";
import { describe, expect, test } from "vitest";
import z from "zod";

import getTestFixtures from "tests/fixtures";

describe("GET /api/v1/blogs/<blogId>/revisions", () => {
  test("Gets all the blog revisions for the chosen blog", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const { blog, initialRevision } = await factory.blogs.insert({ author: authenticatedUser });
    const blogRevisions = await fillArray(
      async () => {
        return await factory.blogRevisions.insert({ blog, editor: authenticatedUser });
      },
      10,
      { sequential: true },
    );
    blogRevisions.push({
      ...initialRevision,
      content: az.with(z.record(z.string(), z.any())).parse(initialRevision.content),
    });

    const factoryRevisionIds = blogRevisions.map((revision) => {
      return revision.id;
    });

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}/revisions`)
      .expect(200);

    const revisions = parseBlogRevisionHistory(body.revisions);
    // One more than the generated 10 because of the initially created revision from the blogs factory
    expect(revisions.length).toBe(11);

    for (const revision of revisions) {
      if (factoryRevisionIds.includes(revision.id)) {
        const factoryRevision = blogRevisions.find((factoryRevision) => {
          return factoryRevision.id === revision.id;
        });

        assertNotUndefined(factoryRevision);

        expect(revision).toMatchObject(factoryRevision);
      } else {
        throw new DataError(
          { factoryRevisionIds, missingId: revision.id },
          "REVISION_NOT_FOUND",
          "Could not find the blog revision",
        );
      }
    }
  });
  test("Can not get blog revisions for a blog the user does not own", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const { blog } = await factory.blogs.insert();

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}/revisions`)
      .expect(403);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
  });
});
