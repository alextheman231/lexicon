import { az, omitProperties } from "@alextheman/utility";
import { AuthProvider } from "@lexicon/models";
import DataFactory from "factory";
import { Pool } from "pg";
import z from "zod";

import { getConnection } from "src/database/connection";

import users from "dev/fixtures/users.json" with { type: "json" };

(async () => {
  const connection = getConnection();
  try {
    const factory = DataFactory.create(connection);

    for (const user of users) {
      const createdUser = await factory.users.insert({
        ...omitProperties(user, "authProviders"),
        dateOfBirth: new Date(user.dateOfBirth),
      });
      for (const authProvider of user.authProviders) {
        await factory.authProviders.insert({
          user: createdUser.id,
          provider: az.with(z.enum(AuthProvider)).parse(authProvider.provider),
          providerUserId: authProvider.providerUserId,
        });
      }
    }

    console.info("Data loaded successfully!");
  } finally {
    if (connection.$client instanceof Pool) {
      await connection.$client.end();
    }
  }
})();
