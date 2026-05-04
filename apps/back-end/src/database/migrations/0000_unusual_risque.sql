CREATE TYPE "public"."AUTH_PROVIDER_T" AS ENUM('google');

--> statement-breakpoint
CREATE TYPE "public"."BLOG_STATE_T" AS ENUM('draft', 'published', 'archived');

--> statement-breakpoint
CREATE TABLE "auth_providers" (
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "provider" "AUTH_PROVIDER_T" NOT NULL,
  "provider_user_id" text NOT NULL,
  "user_id" uuid NOT NULL,
  CONSTRAINT "provider_identity_unique" UNIQUE ("provider", "provider_user_id"),
  CONSTRAINT "user_provider_unique" UNIQUE ("user_id", "provider")
);

--> statement-breakpoint
CREATE TABLE "blog_revisions" (
  "blog_id" uuid NOT NULL,
  "content" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "editor_id" uuid NOT NULL,
  "id" bigserial PRIMARY KEY NOT NULL,
  "revision" integer NOT NULL,
  "revision_message" text,
  "title" varchar(100) NOT NULL
);

--> statement-breakpoint
CREATE TABLE "blog_state_history" (
  "blog_id" uuid NOT NULL,
  "id" bigserial PRIMARY KEY NOT NULL,
  "revision_id" bigint NOT NULL,
  "state" "BLOG_STATE_T" NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_by_id" uuid NOT NULL
);

--> statement-breakpoint
CREATE TABLE "blogs" (
  "author_id" uuid NOT NULL,
  "current_revision_id" bigint,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "published_at" timestamp with time zone,
  "state" "BLOG_STATE_T" NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "published_requires_timestamp" CHECK (
    ("blogs"."state" = 'published') = ("blogs"."published_at" IS NOT NULL)
  )
);

--> statement-breakpoint
CREATE TABLE "users" (
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "date_of_birth" date,
  "description" text,
  "display_name" varchar(50),
  "email" text NOT NULL,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "updated_at" timestamp with time zone,
  "username" varchar(100) NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE ("email"),
  CONSTRAINT "users_username_unique" UNIQUE ("username")
);

--> statement-breakpoint
CREATE TABLE "user_sessions" (
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL
);

--> statement-breakpoint
ALTER TABLE "auth_providers"
ADD CONSTRAINT "auth_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_revisions"
ADD CONSTRAINT "blog_revisions_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_revisions"
ADD CONSTRAINT "blog_revisions_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_state_history"
ADD CONSTRAINT "blog_state_history_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_state_history"
ADD CONSTRAINT "blog_state_history_revision_id_blog_revisions_id_fk" FOREIGN KEY ("revision_id") REFERENCES "public"."blog_revisions" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_state_history"
ADD CONSTRAINT "blog_state_history_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blogs"
ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "user_sessions"
ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
CREATE INDEX "auth_providers_user_id_idx" ON "auth_providers" USING btree ("user_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "blog_revision_per_blog_unique" ON "blog_revisions" USING btree ("blog_id", "revision");

--> statement-breakpoint
CREATE INDEX "blog_revisions_blog_id_revision_idx" ON "blog_revisions" USING btree ("blog_id", "revision");

--> statement-breakpoint
CREATE INDEX "blog_state_history_blog_id_idx" ON "blog_state_history" USING btree ("blog_id");

--> statement-breakpoint
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions" USING btree ("expires_at");
