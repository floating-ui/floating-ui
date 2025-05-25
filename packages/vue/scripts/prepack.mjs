import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');

// Create package.json for CommonJS
const cjsDir = path.join(distDir, 'cjs');
const cjsPackageJson = {type: 'commonjs'};

if (fs.existsSync(cjsDir)) {
  fs.writeFileSync(
    path.join(cjsDir, 'package.json'),
    JSON.stringify(cjsPackageJson, null, 2) + '\n',
  );
  console.log('Created package.json in dist/cjs with type: commonjs');
}

// Create package.json for ES Modules
const esmDir = path.join(distDir, 'esm');
const esmPackageJson = {type: 'module'};

if (fs.existsSync(esmDir)) {
  fs.writeFileSync(
    path.join(esmDir, 'package.json'),
    JSON.stringify(esmPackageJson, null, 2) + '\n',
  );
  console.log('Created package.json in dist/esm with type: module');
}
