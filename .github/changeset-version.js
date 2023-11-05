const {execSync} = require('node:child_process');

// This script is used by the `release.yml` workflow to update the version of the packages being released.
// The standard step is only to run `changeset version` but this does not update the package-lock.json file.
// So we also run `npm install`, which does this update.
// This is a workaround until this is handled automatically by `changeset version`.
// See https://github.com/changesets/changesets/issues/421.
execSync('npx changeset version');
execSync('npm install');
