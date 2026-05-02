import type { Blog, BlogInsertData, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import { getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { BlogState } from "@lexicon/models";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import { insertBlog } from "src/services/blogs";

class BlogFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<string, Blog>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.records = {};
    this.users = users;
  }

  private static generateEditorContent(text: string) {
    return {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text,
                type: "text",
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 0,
            textStyle: "",
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };
  }

  public async insert(
    data: Partial<Omit<BlogInsertData, "authorId"> & { author?: string | User }> = {},
  ) {
    const authorId = await getIdFromFactoryResource<string>(data.author, this.users);

    const blog = await insertBlog(this.context.connection, {
      authorId,
      title: faker.music.songName(),
      content: BlogFactory.generateEditorContent(faker.lorem.sentences(getRandomNumber(0, 5))),
      state: BlogState.CREATED,
      ...omitProperties(data, "author"),
    });

    this.records[blog.id] = blog;
    return blog;
  }
}

export default BlogFactory;
