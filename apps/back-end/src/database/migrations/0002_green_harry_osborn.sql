ALTER TABLE "blog_revisions"
RENAME COLUMN "revision" TO "version";

--> statement-breakpoint
DROP INDEX "blog_revision_per_blog_unique";

--> statement-breakpoint
DROP INDEX "blog_revisions_blog_id_revision_idx";

--> statement-breakpoint
CREATE UNIQUE INDEX "blog_revision_per_blog_unique" ON "blog_revisions" USING btree ("blog_id", "version");

--> statement-breakpoint
CREATE INDEX "blog_revisions_blog_id_revision_idx" ON "blog_revisions" USING btree ("blog_id", "version");
