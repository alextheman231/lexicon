CREATE TYPE "public"."EMAIL_IDENT_T" AS ENUM('RESET_PASSWORD');

--> statement-breakpoint
CREATE TABLE "emails" (
  "context" jsonb NOT NULL,
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "ident" "EMAIL_IDENT_T" NOT NULL,
  "recipient_id" uuid NOT NULL,
  "sent_at" timestamp with time zone
);

--> statement-breakpoint
ALTER TABLE "emails"
ADD CONSTRAINT "emails_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;
