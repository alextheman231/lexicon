ALTER TABLE blog_revisions
ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();

ALTER TABLE blog_revisions
DROP CONSTRAINT blog_revisions_pkey CASCADE;

ALTER TABLE blog_revisions
ADD PRIMARY KEY (uuid_id);

ALTER TABLE blogs
ADD COLUMN current_revision_uuid UUID;

UPDATE blogs
SET
  current_revision_uuid = blog_revisions.uuid_id
FROM
  blog_revisions
WHERE
  blogs.current_revision_id = blog_revisions.id;

ALTER TABLE blog_state_history
ADD COLUMN revision_uuid UUID REFERENCES blog_revisions (uuid_id);

UPDATE blog_state_history
SET
  revision_uuid = blog_revisions.uuid_id
FROM
  blog_revisions
WHERE
  blog_state_history.revision_id = blog_revisions.id;

ALTER TABLE blog_revisions
DROP COLUMN id;

ALTER TABLE blog_revisions
RENAME COLUMN uuid_id TO id;

ALTER TABLE blog_state_history
DROP COLUMN revision_id;

ALTER TABLE blog_state_history
RENAME COLUMN revision_uuid TO revision_id;

ALTER TABLE blogs
DROP COLUMN current_revision_id;

ALTER TABLE blogs
RENAME COLUMN current_revision_uuid TO current_revision_id;
