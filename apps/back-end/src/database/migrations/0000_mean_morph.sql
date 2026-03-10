CREATE TYPE "public"."BLOG_STATE_T" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "blog_revisions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"editor_id" uuid NOT NULL,
	"blog_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" jsonb NOT NULL,
	"revision" integer NOT NULL,
	"revision_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_state_history" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"updated_by_id" uuid NOT NULL,
	"blog_id" uuid NOT NULL,
	"state" "BLOG_STATE_T" NOT NULL,
	"revision_id" bigint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"current_revision_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"display_name" varchar(50),
	"email" varchar(100) NOT NULL,
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blog_revisions" ADD CONSTRAINT "blog_revisions_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_revisions" ADD CONSTRAINT "blog_revisions_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_state_history" ADD CONSTRAINT "blog_state_history_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_state_history" ADD CONSTRAINT "blog_state_history_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_state_history" ADD CONSTRAINT "blog_state_history_revision_id_blog_revisions_id_fk" FOREIGN KEY ("revision_id") REFERENCES "public"."blog_revisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_revision_per_blog_unique" ON "blog_revisions" USING btree ("blog_id","revision");--> statement-breakpoint
CREATE INDEX "blog_revisions_blog_id_revision_idx" ON "blog_revisions" USING btree ("blog_id","revision");--> statement-breakpoint
CREATE INDEX "blog_state_history_blog_id_idx" ON "blog_state_history" USING btree ("blog_id");