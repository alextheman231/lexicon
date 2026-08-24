# Description of Changes

## Risk level: Medium

This is a medium risk change because it involves a change to the database schema, otherwise known as a migration. It must pass the CI checks in order for changes to be merged and deployed. 

Any migration files introduced in this pull request must not be edited manually after this gets merged and applied. The only exception to this is if the migration fails to apply in the first place, in which case the migration file should be edited so that it can apply successfully.

## Type of Change

The type of changes made can be found on the labels associated with the pull request. The exact changes made can be found under the commits tab.
