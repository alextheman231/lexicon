# Contributing to Lexicon

This repository uses the `pnpm` package manager throughout all workspaces. To install all dependencies in all workspaces, you will need to run

```bash
pnpm install
```

Per-workspace dependencies can be installed by changing directory then running the install command in the workspace's directory.

## Back-end

### Setup

In order to proceed you will first need to install Postgres on your system. We recommend using Postgres 18 because this is what our production database and CI runs against. This can be installed via Homebrew by doing:

```bash
brew install postgresql@18
```

From there, to start the service you will need to run

```bash
brew services start postgresql
```

Verify that Postgres is running by doing

```bash
psql --version
```

If successful, you should see something like this:

```bash
psql (PostgreSQL) 18.4 (Homebrew)
```

You will then need to initialise a `.env.test` and `.env.development` file so you can use the test and development databases. These files should not be committed as exact contents may differ between users, but as a starting point, I would recommend putting the following in `.env.test`:

```bash
DATABASE_URL="postgres://<user>@localhost:5432/lexicon_test"
API_BASE_URL="http://localhost:8080"
```

where `<user>` should be replaced with your system username.

and the following in `.env.development`.

```bash
GOOGLE_CLIENT_ID="<client-id-here>"
GOOGLE_CLIENT_SECRET="<client-secret-here>"
DATABASE_URL="postgres://<user>@localhost:5432/lexicon_dev"
API_BASE_URL="http://localhost:8080"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"
```

You can [create a Google Cloud project here](https://console.cloud.google.com/) to get the Google Client ID and Google Client secret.

From there, initialise the dev database by running

```bash
pnpm run recreate-db
```

in the back-end directory. This will drop the database if it exists, then create it, apply migrations, and load it with the necessary dev data.

### Creating a Migration

You will need to create a new migration if you wish to add a new resource to Lexicon. To do this, add a new schema to `src/database/schemas`. Then, with your terminal set to the back-end directory, run `pnpm run generate-migration` to generate a new migration. Also do look at the generated SQL in the migration to confirm it is doing exactly what you want it to do (e.g. if renaming a column, confirm that it actually renamed it rather than drop/recreate it).

Once you've confirmed the generated SQL is doing exactly what you want it to do, run `pnpm run migrate-db` to apply the migration to the dev database.

### Data Factory

In our tests, we use the data factory to generate data for each individual test to use. The idea is that each test should independently set up the data they are going to be asserting against rather than rely on some global pre-seeded database, as the first of these is a lot more maintainable.

To set this up, create a new factory class. It should have a constructor that just initialises the context, and an insert method which inserts the resource, preferably by calling the corresponding model function to help with that.

If the resource has related resources, the insert function should also have a property named after the related resource, where it can either take the resource itself, the ID of the resource, or nothing. In the case where nothing is passed in, a related resource should be generated and the ID extracted. In the case where a resource is passed in, the ID should be extracted from it. You can use the `getIdFromFactoryResource` helper for most use cases.

### The project structure

The project is broken up into multiple parts. At root-level we have:

- `dev` for development-related procedures (e.g. dev database seeding, dev data fixtures...)
- `tests` for the tests.
- `factory` for the data factory, shared across both `tests` and `dev`.
- `src` for the source code.

The `src` folder is then split further into:
- `src/database` for the database connection itself and the schemas.
- `src/server` for the endpoints and general server logic.
- `src/services` for reusable pieces of business logic.
- `src/models` for reusable pieces of simple database queries.
- `src/utility` for reusable pieces of general JavaScript logic.

Perhaps the main potential point of confusion could be with `services` and `models` and the difference between them. In general:

- A model function should only perform one query on one table, and return all resource properties (with the exception of anything that should be considered sensitive, e.g. passwords), whereas a service function can then compose model functions in a way that allows endpoint logic to just call it and have all business logic applied.
- Models should be named after the SQL keyword (e.g. `selectUser`, `insertUser`, `updateUser`...), whereas services should be named differently (e.g. `getUser`, `createUser`, `editUser`...).
- Models that mutate database state should never be imported directly into endpoint logic - they should use a service function instead for that (although calling a `select` model function is ok).

## Front-end

### Project Structure

At root-level, we have just `src` for the source code. The `src` folder is then split up into:

- `src/components` for reusable components across all resources.
- `src/groups` for grouped components following the compound component structure (e.g. `QueryBoundary`)
- `src/hooks` for reusable hooks.
- `src/pages` for general pages.
- `src/resources` to group related components/pages by back-end resource.

### Custom Wrappers

We also have some general wrapper functions/components that wrap around existing implementations from external packages that should be preferred over the initial implementation. Namely:

- `createBaseQueryBoundary`, `createItemQueryBoundary`, and `createListQueryBoundary` from `src/groups/QueryBoundary` should be used over the ones from `@alextheman/components`
    - `createBaseQueryBoundary` adds a custom `Error` component that extends the existing one with `codeErrorMap` and `errorFunction`, where `codeErrorMap` is a mapping of error codes from `CodeError`, and `errorFunction` deals with more generic errors beyond API errors.
    - `createItemQueryBoundary` extends the existing base set and adds `Data`, which is identical to the existing one (but this would just ensure that this collection also uses the custom `Error`).
    - `createListQueryBoundary` extends the existing base and adds `DataMap`, which is identical to the existing one, as well as a custom `DataRowsMap`, which is more suited for mapping over a list of data where it is expected to be rendered as a table.
- `useQuery` and `useMutation` from `src/hooks/query` should be used over the ones from `@tanstack/react-query`.
    - Both of these standardise retry logic and ensure that if a 500 error was thrown from the back-end, it also throws on the front-end.
- `createFormHook` from `@alextheman/components` should be used over the one from `@tanstack/react-form`
    - Our `createFormHook` gives us some of our own `formComponents` and `fieldComponents` by default, which we can then expand upon in Lexicon itself if needed.


## Pull Requests

All pull requests must pass our CI checks in order for it to be merged. Our CI process will run linting in all workspaces, testing in all workspaces, and end-to-end tests. These can be run locally using the respective commands or the pre-commit hook, but whether or not it passes CI is the most important thing.

Once it passes CI, if you're me you can merge it in. If you're not me, you must wait for my approval. Once merged, the changes will be deployed via the `deploy-production` workflow.
