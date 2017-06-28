#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const xml = require('xml');
const ignoreToGlob = require('gitignore-to-glob');
const glob = require('glob-fs')({ gitignore: false });
const nuget = require('nuget-in-path');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const nuspecPath = path.resolve(process.cwd(), 'package.nuspec');

// Convert npmignore to list of glob patterns
const npmignore = ['!**/node_modules/**', '!**/package.nuspec']
  .concat(ignoreToGlob(path.resolve(process.cwd(), '.npmignore')))
  .filter(pattern => !(pattern.indexOf('/*/**') === pattern.length - 5));

// Use these patterns to match all the files that should get included
// and generate a list of XML `file`
const files = glob
  .readdirSync(`(${npmignore.join('|')})`)
  .map(
    file =>
      fs.statSync(file).isFile() && {
        file: {
          _attr: {
            src: file,
          },
        },
      }
  )
  .filter(f => f);

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
        { files },
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
    fs.unlinkSync(nuspecPath);
    if (err) {
      return console.error(err);
    }
    console.info(`Nuget: Successfully pushed ${nupkg.path}`);
  });
});
