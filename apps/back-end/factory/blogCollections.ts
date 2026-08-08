import type { BlogCollection, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { BlogCollectionInsert } from "src/database/schema";

import { getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { and, eq } from "drizzle-orm";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import { blogCollectionsTable } from "src/database/schema";
import insertBlogCollection from "src/models/blogCollections/insertBlogCollection";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface BlogCollectionRelations {
  user: string | User;
}
export type BlogCollectionFactoryDataBase = Omit<BlogCollectionInsert, "userId">;
type BlogCollectionFactoryData = Partial<BlogCollectionFactoryDataBase & BlogCollectionRelations>;
type BlogCollectionFactoryDataStrict = Partial<BlogCollectionFactoryDataBase> &
  BlogCollectionRelations;

class BlogCollectionFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<string, BlogCollection>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.users = users;
    this.records = {};
  }

  public async insert(data: BlogCollectionFactoryData = {}): Promise<BlogCollection> {
    const userId = await getIdFromFactoryResource<string>(data?.user, this.users);

    let name = data?.name;

    while (name === undefined) {
      const candidate = faker.music.album();
      const existingCollectionId = await fetchSole(
        this.context.connection
          .select({ id: blogCollectionsTable.id })
          .from(blogCollectionsTable)
          .where(
            and(eq(blogCollectionsTable.userId, userId), eq(blogCollectionsTable.name, candidate)),
          ),
      );

      if (existingCollectionId === null) {
        name = candidate;
      }
    }

    const blogCollectionTemplate: BlogCollectionInsert = {
      userId,
      name,
      description: faker.lorem.sentences(getRandomNumber(0, 5)),
      ...omitProperties(data, "user"),
    };

    const blogCollection = await insertBlogCollection(
      this.context.connection,
      blogCollectionTemplate,
    );
    this.records[blogCollection.id] = blogCollection;
    return blogCollection;
  }
  public async insertStrict(data: BlogCollectionFactoryDataStrict): Promise<BlogCollection> {
    return await this.insert(data);
  }
}

export default BlogCollectionFactory;
