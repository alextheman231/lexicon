import type { BlogCollection, BlogCollectionItem } from "@lexicon/models";
import type BlogCollectionFactory from "factory/blogCollections";
import type BlogFactory from "factory/blogs";
import type FactoryContext from "factory/context";

import type { Blog, BlogCollectionItemInsert } from "src/database/schema";

import { containsKeys, omitProperties } from "@alextheman/utility";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import insertBlogCollectionItem from "src/models/blogCollections/insertBlogCollectionItem";
import findLatestBlogCollectionItemNumber from "src/services/blogCollections/findLatestBlogCollectionItemNumber";

type BlogCollectionItemFactoryData = Partial<
  Omit<BlogCollectionItemInsert, "blogId" | "blogCollectionId"> & {
    blog: string | Blog;
    blogCollection: string | BlogCollection;
  }
>;

class BlogCollectionItemFactory {
  private blogCollections: BlogCollectionFactory;
  private blogs: BlogFactory;
  private context: FactoryContext;

  public records: Record<string, BlogCollectionItem> = {};

  public constructor(
    context: FactoryContext,
    blogs: BlogFactory,
    blogCollections: BlogCollectionFactory,
  ) {
    this.context = context;
    this.blogs = blogs;
    this.blogCollections = blogCollections;
    this.records = {};
  }

  public async insert(data: BlogCollectionItemFactoryData = {}): Promise<BlogCollectionItem> {
    const blogId = await (async () => {
      if (data.blog === undefined) {
        const { blog } = await this.blogs.insertWithRevision();
        return blog.id;
      }
      if (containsKeys(data.blog, "id")) {
        return data.blog.id;
      }
      return data.blog;
    })();
    await getIdFromFactoryResource<string>(data?.blog, this.blogs);
    const blogCollectionId = await getIdFromFactoryResource<string>(
      data?.blogCollection,
      this.blogCollections,
    );

    const latestItemNumber = await findLatestBlogCollectionItemNumber(
      this.context.connection,
      blogCollectionId,
    );
    const blogCollectionItemTemplate: BlogCollectionItemInsert = {
      blogId,
      blogCollectionId,
      itemNumber: latestItemNumber !== null ? latestItemNumber + 1 : 1,
      ...omitProperties(data, ["blog", "blogCollection"]),
    };

    const blogCollectionItem = await insertBlogCollectionItem(
      this.context.connection,
      blogCollectionItemTemplate,
    );

    this.records[blogCollectionItem.id] = blogCollectionItem;
    return blogCollectionItem;
  }
}

export default BlogCollectionItemFactory;
