const fs = require('fs');
const path = require('path');
const xml = require('xml');
const ignoreToGlob = require('gitignore-to-glob');
const nuget = require('nuget');
const pkg = require('../package.json');

const nuspecPath = path.resolve(__dirname, '../package.nuspec');

// Convert npmignore to list of glob patterns
// We have to invert any negation (!) because we are going to use this
// in the `exclude` attribute of nuspec
const npmignore = ignoreToGlob(path.resolve(__dirname, '../.npmignore')).map(
  pattern => (pattern.indexOf('!') === 0 ? pattern.slice(1) : `!${pattern}`)
);

// Generate nuspec file
const nuspec = xml(
  [
    {
      package: [
        {
          _attr: {
            xmlns: 'http://schemas.microsoft.com/packaging/2011/08/nuspec.xsd',
          },
        },
        {
          metadata: [
            { id: pkg.name },
            { version: pkg.version },
            { description: pkg.description },
            { authors: 'FezVrasta' },
            { projectUrl: pkg.homepage },
          ],
        },
        {
          files: [
            {
              file: {
                _attr: {
                  src: '*',
                  target: 'content\\Scripts',
                  exclude: npmignore.join(';'),
                },
              },
            },
          ],
        },
      ],
    },
  ],
  { declaration: true, indent: true }
);

fs.writeFileSync(nuspecPath, nuspec);

nuget.pack(nuspecPath, (err, nupkg) => {
  if (err) {
    return console.error(err);
  }
  nuget.push(nupkg, err => {
    if (err) {
      return console.error(err);
    }
    console.info(`Nuget: Successfully pushed ${nupkg.path}`);
  });
});
