import type { BlogRevision, User } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { Blog, BlogRevisionInsert } from "src/database/schema";

import { assertNotNull, az, getRandomNumber, omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import BlogFactory from "factory/blogs";
import z from "zod";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import insertBlogRevision from "src/models/blogs/insertBlogRevision";
import selectBlog from "src/models/blogs/selectBlog";
import updateBlog from "src/models/blogs/updateBlog";
import findLatestBlogVersion from "src/services/blogs/views/findLatestBlogRevision";
import loadBlogView from "src/services/blogs/views/loadBlogView";

interface BlogRevisionRelations {
  editor: string | User;
  blog: string | Blog;
}
type BlogRevisionFactoryDataBase = Omit<BlogRevisionInsert, "editorId" | "blogId">;
type BlogRevisionFactoryData = Partial<BlogRevisionFactoryDataBase & BlogRevisionRelations>;
type BlogRevisionFactoryDataStrict = Partial<BlogRevisionFactoryDataBase> & BlogRevisionRelations;

class BlogRevisionFactory {
  private blogs: BlogFactory;
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<string, BlogRevision>;

  public constructor(context: FactoryContext, users: UserFactory, blogs: BlogFactory) {
    this.context = context;
    this.records = {};
    this.users = users;
    this.blogs = blogs;
  }

  public async insert(data: BlogRevisionFactoryData = {}): Promise<BlogRevision> {
    const blogId = await getIdFromFactoryResource<string>(data.blog, this.blogs);

    const blog = await selectBlog(this.context.connection, blogId);
    assertNotNull(blog);
    const blogView = await loadBlogView(this.context.connection, { blogId });

    const editorId =
      data.editor !== undefined
        ? await getIdFromFactoryResource<string>(data.editor, this.users)
        : blog.authorId;

    const latestVersion = (await findLatestBlogVersion(this.context.connection, blogId)) ?? 0;

    const blogRevisionTemplate: BlogRevisionInsert = {
      editorId,
      blogId,
      title: data.title ?? blogView?.title ?? faker.book.title(),
      content:
        data.content ??
        blogView?.content ??
        BlogFactory.generateEditorContent(faker.lorem.sentences(getRandomNumber(0, 5))),
      version: data.version ?? latestVersion + 1,
      ...omitProperties(data, ["editor", "blog"]),
    };
    const revision = await insertBlogRevision(this.context.connection, blogRevisionTemplate);
    await updateBlog(this.context.connection, blogId, { currentRevisionId: revision.id });

    const newRevision = {
      ...revision,
      content: az.with(z.record(z.string(), z.any())).parse(revision.content),
    };

    this.records[newRevision.id] = newRevision;
    return newRevision;
  }
  public async insertStrict(data: BlogRevisionFactoryDataStrict): Promise<BlogRevision> {
    return await this.insert(data);
  }
}

export default BlogRevisionFactory;
