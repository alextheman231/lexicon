import type { Connection } from "src/database/connection";

import AuthProviderFactory from "factory/authProviders";
import BlogCollectionItemFactory from "factory/blogCollectionItems";
import BlogCollectionFactory from "factory/blogCollections";
import BlogRevisionFactory from "factory/blogRevision";
import BlogFactory from "factory/blogs";
import FactoryContext from "factory/context";
import UserFactory from "factory/users";
import UserSessionFactory from "factory/userSessions";

class DataFactory {
  private context: FactoryContext;

  public authProviders: AuthProviderFactory;
  public blogCollectionItems: BlogCollectionItemFactory;
  public blogCollections: BlogCollectionFactory;
  public blogRevisions: BlogRevisionFactory;
  public blogs: BlogFactory;
  public users: UserFactory;
  public userSessions: UserSessionFactory;

  public constructor(context: FactoryContext) {
    this.context = context;

    this.users = new UserFactory(this.context);
    this.blogs = new BlogFactory(this.context, this.users);
    this.blogCollections = new BlogCollectionFactory(this.context, this.users);
    this.blogCollectionItems = new BlogCollectionItemFactory(
      this.context,
      this.blogs,
      this.blogCollections,
    );
    this.blogRevisions = new BlogRevisionFactory(this.context, this.users, this.blogs);
    this.authProviders = new AuthProviderFactory(this.context, this.users);
    this.userSessions = new UserSessionFactory(this.context, this.users);
  }

  public static create(connection: Connection): DataFactory {
    const context = new FactoryContext(connection);
    return new DataFactory(context);
  }
}

export default DataFactory;
