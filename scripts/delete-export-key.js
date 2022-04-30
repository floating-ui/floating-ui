const glob = require('glob');
const fs = require('fs');

const files = glob.sync('packages/**/package.json');

files.forEach((file) => {
  const data = fs.readFileSync(file, 'utf-8');
  const pkg = JSON.parse(data);

  if (pkg.exports) {
    delete pkg.exports['./src/index.ts'];
  }

  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
});
