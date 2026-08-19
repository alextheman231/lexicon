ALTER TABLE "users"
ADD COLUMN "profile_picture_file_key" text;

--> statement-breakpoint
ALTER TABLE "users"
ADD COLUMN "profile_picture_file_name" text;
