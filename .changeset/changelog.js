/** @type {import("@changesets/types").ChangelogFunctions["getDependencyReleaseLine"]} */
function getDependencyReleaseLine(_, dependenciesUpdated) {
  if (dependenciesUpdated.length === 0) return '';
  const updatedDepenenciesList = dependenciesUpdated.map(
    (dependency) => `\`${dependency.name}@${dependency.newVersion}\``,
  );
  return `- Update dependencies: ${updatedDepenenciesList.join(', ')}`;
}

/** @type {import("@changesets/types").ChangelogFunctions["getReleaseLine"]} */
function getReleaseLine(changeset) {
  const [firstLine, ...nextLines] = changeset.summary
    .split('\n')
    .map((l) => l.trimEnd());

  if (!nextLines.length) return `- ${firstLine}`;

  return `- ${firstLine}\n${nextLines.join('\n')}`;
}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
