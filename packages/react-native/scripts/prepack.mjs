import fs from 'fs';
import path from 'path';

// Create package.json files for dist directories
const distDirs = ['dist/cjs', 'dist/esm'];

for (const dir of distDirs) {
  const isESM = dir.includes('esm');
  const packageJsonContent = {
    type: isESM ? 'module' : 'commonjs',
  };

  const packageJsonPath = path.join(dir, 'package.json');
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2),
  );
}
