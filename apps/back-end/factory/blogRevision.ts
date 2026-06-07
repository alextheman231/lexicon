import type { Blog, BlogRevision, User } from "@lexicon/models";
import type BlogFactory from "factory/blogs";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { BlogRevisionInsert } from "src/database/schema";

import { assertNotNull, omitProperties } from "@alextheman/utility";
import { parseBlogRevision } from "@lexicon/models";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import insertBlogRevision from "src/models/blogs/insertBlogRevision";
import { getLatestBlogVersion, selectBlogView } from "src/services/blogs";

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

  public async insert(
    data: Partial<
      Omit<BlogRevisionInsert, "editorId" | "blogId"> & {
        editor: string | User;
        blog: string | Blog;
      }
    > = {},
  ): Promise<BlogRevision> {
    const editorId = await getIdFromFactoryResource<string>(data.editor, this.users);
    const blogId = await getIdFromFactoryResource<string>(data.blog, this.blogs);

    const blogView = await selectBlogView(this.context.connection, blogId);
    assertNotNull(blogView);
    const latestVersion = await getLatestBlogVersion(this.context.connection, blogId);
    assertNotNull(latestVersion);

    const blogRevisionTemplate: BlogRevisionInsert = {
      editorId,
      blogId,
      title: data.title ?? blogView.title,
      content: data.content ?? blogView.content,
      version: data.version ?? latestVersion + 1,
      ...omitProperties(data, ["editor", "blog"]),
    };
    const createdRevision = await insertBlogRevision(this.context.connection, blogRevisionTemplate);
    const revision = parseBlogRevision(createdRevision);

    this.records[revision.id] = revision;
    return revision;
  }
}

export default BlogRevisionFactory;
