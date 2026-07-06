import type { CreateBlogData, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { Blog, BlogInsert, BlogRevision } from "src/database/schema";

import { assertNotNull, getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { BlogState } from "@lexicon/models";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import insertBlog from "src/models/blogs/insertBlog";
import insertBlogRevision from "src/models/blogs/insertBlogRevision";
import insertBlogStateHistory from "src/models/blogs/insertBlogStateHistory";
import selectBlog from "src/models/blogs/selectBlog";
import updateBlog from "src/models/blogs/updateBlog";

interface BlogRelations {
  author: string | User;
}
export type BlogFactoryDataBase<InsertType extends object = Record<string, unknown>> = Omit<
  InsertType,
  "authorId"
>;
type BlogFactoryData<InsertType extends object = Record<string, unknown>> = Partial<
  BlogFactoryDataBase<InsertType> & BlogRelations
>;
type BlogFactoryDataStrict<InsertType extends object = Record<string, unknown>> = Partial<
  BlogFactoryDataBase<InsertType>
> &
  BlogRelations;

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

  public async insert(data: BlogFactoryData<BlogInsert> = {}): Promise<Blog> {
    const authorId = await getIdFromFactoryResource<string>(data.author, this.users);
    const blogTemplate: BlogInsert = {
      authorId,
      state: BlogState.DRAFT,
      ...omitProperties(data, "author"),
    };
    const today = new Date();

    const blog = await insertBlog(this.context.connection, {
      ...blogTemplate,
      authorId,
      publishedAt: blogTemplate.state === BlogState.PUBLISHED ? today : null,
      updatedAt: today,
    });

    return blog;
  }
  public async insertStrict(data: BlogFactoryDataStrict<BlogInsert>): Promise<Blog> {
    return await this.insert(data);
  }
  public async insertWithRevision(
    data: BlogFactoryData<CreateBlogData & { id: string }> = {},
  ): Promise<{ blog: Blog; revision: BlogRevision }> {
    const authorId = await getIdFromFactoryResource<string>(data.author, this.users);
    const blogTemplate: CreateBlogData & { id?: string } = {
      title: faker.music.songName(),
      content: BlogFactory.generateEditorContent(faker.lorem.sentences(getRandomNumber(0, 5))),
      state: BlogState.PUBLISHED,
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
      version: 1,
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
    return { blog, revision };
  }
  public async insertWithRevisionStrict(
    data: BlogFactoryDataStrict<CreateBlogData & { id: string }>,
  ): Promise<{ blog: Blog; revision: BlogRevision }> {
    return await this.insertWithRevision(data);
  }
}

export default BlogFactory;
