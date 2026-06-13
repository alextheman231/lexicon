import type { BlogCollection, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { BlogCollectionInsert } from "src/database/schema";

import { getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import insertBlogCollection from "src/models/blogCollections/insertBlogCollection";

type BlogCollectionFactoryData = Partial<
  Omit<BlogCollectionInsert, "userId"> & { user?: string | User }
>;

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

    const blogCollectionTemplate: BlogCollectionInsert = {
      userId,
      name: data?.name ?? faker.music.album(),
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
}

export default BlogCollectionFactory;
