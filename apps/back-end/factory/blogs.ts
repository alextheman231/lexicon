import type { Blog, CreateBlogData, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import { assertNotNull, getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { BlogState } from "@lexicon/models";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import {
  insertBlog,
  insertBlogRevision,
  insertBlogStateHistory,
  selectBlog,
  updateBlog,
} from "src/models/blogs";

class BlogFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<string, Blog>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.records = {};
    this.users = users;
  }

  public static generateEditorContent(text: string) {
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
    data: Partial<Omit<CreateBlogData, "authorId"> & { id: string; author: string | User }> = {},
  ) {
    const authorId = await getIdFromFactoryResource<string>(data.author, this.users);
    const blogTemplate: CreateBlogData = {
      title: faker.music.songName(),
      content: BlogFactory.generateEditorContent(faker.lorem.sentences(getRandomNumber(0, 5))),
      state: BlogState.DRAFT,
      ...omitProperties(data, "author"),
    };
    const today = new Date();

    const initialBlog = await insertBlog(this.context.connection, {
      ...blogTemplate,
      authorId,
      publishedAt: blogTemplate.state === BlogState.PUBLISHED ? today : null,
      updatedAt: today,
    });
    const revision = await insertBlogRevision(this.context.connection, {
      editorId: authorId,
      blogId: initialBlog.id,
      title: blogTemplate.title,
      content: blogTemplate.content,
      revision: 1,
    });
    await updateBlog(this.context.connection, initialBlog.id, { currentRevisionId: revision.id });
    await insertBlogStateHistory(this.context.connection, {
      state: initialBlog.state,
      blogId: initialBlog.id,
      revisionId: revision.id,
      updatedById: initialBlog.authorId,
    });

    const blogModel = await selectBlog(this.context.connection, initialBlog.id);

    assertNotNull(blogModel);
    const { currentRevisionId } = blogModel;
    assertNotNull(currentRevisionId);

    const blog = { ...blogModel, currentRevisionId };

    this.records[blog.id] = blog;
    return blog;
  }
}

export default BlogFactory;
