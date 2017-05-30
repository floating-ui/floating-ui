const fs = require('fs');
const path = require('path');
const xml = require('xml');
const nuget = require('nuget');
const pkg = require('../package.json');

const nuspecPath = path.resolve(__dirname, '../package.nuspec');

const distPath = path.resolve(__dirname, '../dist/');
const distFiles = [];
fs.readdirSync(distPath).forEach(file => {
  const filePath = path.join(distPath, file);
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    distFiles.push({
      file: {
        _attr: {
          src: 'dist/' + file ,
        },
      },
    });
  }
});

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
          files: distFiles,
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
