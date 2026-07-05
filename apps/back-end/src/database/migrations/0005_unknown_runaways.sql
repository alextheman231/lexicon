ALTER TABLE "blog_collection_items"
ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;

--> statement-breakpoint
ALTER TABLE "blog_collections"
ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
