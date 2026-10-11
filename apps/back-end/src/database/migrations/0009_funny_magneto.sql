CREATE TYPE "public"."USER_STATE_T" AS ENUM('verified', 'unverified');

--> statement-breakpoint
CREATE TABLE "user_state_history" (
  "user_id" uuid NOT NULL,
  "id" bigserial PRIMARY KEY NOT NULL,
  "state" "USER_STATE_T" NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_by_id" uuid
);

--> statement-breakpoint
ALTER TABLE "users"
ADD COLUMN "state" "USER_STATE_T" NOT NULL DEFAULT 'verified';

ALTER TABLE "users"
ALTER COLUMN "state"
DROP DEFAULT;

--> statement-breakpoint
ALTER TABLE "user_state_history"
ADD CONSTRAINT "user_state_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "user_state_history"
ADD CONSTRAINT "user_state_history_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
CREATE INDEX "user_state_history_user_id_idx" ON "user_state_history" USING btree ("user_id");

INSERT INTO
  user_state_history (user_id, state, updated_at, updated_by_id)
SELECT
  users.id AS user_id,
  users.state,
  users.created_at,
  NULL
FROM
  users
