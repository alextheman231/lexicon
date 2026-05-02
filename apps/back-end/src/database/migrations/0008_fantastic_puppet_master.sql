ALTER TABLE "blogs"
ADD CONSTRAINT "published_requires_timestamp" CHECK (
  ("blogs"."state" = 'published') = ("blogs"."published_at" IS NOT NULL)
);
