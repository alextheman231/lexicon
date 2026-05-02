CREATE TYPE "public"."AUTH_PROVIDER_T" AS ENUM('google');

--> statement-breakpoint
CREATE TABLE "auth_providers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "provider" "AUTH_PROVIDER_T" NOT NULL,
  "provider_user_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "provider_identity_unique" UNIQUE ("provider", "provider_user_id"),
  CONSTRAINT "user_provider_unique" UNIQUE ("user_id", "provider")
);

--> statement-breakpoint
ALTER TABLE "auth_providers"
ADD CONSTRAINT "auth_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
CREATE INDEX "auth_providers_user_id_idx" ON "auth_providers" USING btree ("user_id");
