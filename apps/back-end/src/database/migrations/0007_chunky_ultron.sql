CREATE TYPE "public"."BLOG_STATE_T_NEW" AS ENUM('draft', 'published', 'archived');

ALTER TABLE "blogs"
ALTER COLUMN "state" TYPE "public"."BLOG_STATE_T_NEW" USING "state"::TEXT::"public"."BLOG_STATE_T_NEW";

ALTER TABLE "blog_state_history"
ALTER COLUMN "state" TYPE "public"."BLOG_STATE_T_NEW" USING "state"::TEXT::"public"."BLOG_STATE_T_NEW";

DROP TYPE "public"."BLOG_STATE_T";

ALTER TYPE "public"."BLOG_STATE_T_NEW"
RENAME TO "BLOG_STATE_T";
