ALTER TABLE "blog_revisions"
DROP CONSTRAINT "blog_revisions_blog_id_blogs_id_fk";

--> statement-breakpoint
ALTER TABLE "blog_state_history"
DROP CONSTRAINT "blog_state_history_blog_id_blogs_id_fk";

--> statement-breakpoint
ALTER TABLE "blog_revisions"
ADD CONSTRAINT "blog_revisions_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "blog_state_history"
ADD CONSTRAINT "blog_state_history_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs" ("id") ON DELETE cascade ON UPDATE no action;
