CREATE TABLE "blog_collection_items" (
  "blog_collection_id" uuid NOT NULL,
  "blog_id" uuid NOT NULL,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "item_number" integer NOT NULL
);

--> statement-breakpoint
CREATE TABLE "blog_collections" (
  "description" text,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "user_id" uuid NOT NULL
);

--> statement-breakpoint
ALTER TABLE "blog_collection_items"
ADD CONSTRAINT "blog_collection_items_blog_collection_id_blog_collections_id_fk" FOREIGN KEY ("blog_collection_id") REFERENCES "public"."blog_collections" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_collection_items"
ADD CONSTRAINT "blog_collection_items_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_collections"
ADD CONSTRAINT "blog_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
CREATE UNIQUE INDEX "blog_collection_item_number_per_blog_collection_unique" ON "blog_collection_items" USING btree ("item_number", "blog_collection_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "blog_collection_blog_unique" ON "blog_collection_items" USING btree ("blog_collection_id", "blog_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "blog_collection_name_per_user_unique" ON "blog_collections" USING btree ("user_id", "name");
