import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const rootDir = path.join(__dirname, '..');

/**
 * Add PURE annotations to React.forwardRef calls
 * This fixes tree-shaking issues where React.forwardRef calls prevent
 * unused components from being removed by bundlers.
 * https://github.com/rolldown/tsdown/issues/257
 */
function addPureAnnotations(content) {
  const lines = content.split('\n');
  const updatedLines = lines.map((line) => {
    if (line.includes('React.forwardRef(')) {
      if (line.includes('/* @__PURE__ */')) {
        return line; // Already has PURE annotation, don't modify
      }
      // Add PURE annotation before React.forwardRef
      return line.replace(
        /(.*?)(React\.forwardRef\()/g,
        '$1/* @__PURE__ */ $2',
      );
    }
    return line;
  });

  return updatedLines.join('\n');
}

function processJSFiles(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir, {withFileTypes: true});

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      processJSFiles(filePath);
    } else if (file.isFile() && file.name.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = addPureAnnotations(content);

      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(
          `Added PURE annotations to: ${path.relative(distDir, filePath)}`,
        );
      }
    }
  }
}

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

// Create top-level utils directory with package.json
const utilsDir = path.join(rootDir, 'utils');
const utilsPackageJson = {
  main: '../dist/cjs/utils/index.js',
  module: '../dist/esm/utils/index.js',
  types: '../dist/cjs/utils/index.d.ts',
};

if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, {recursive: true});
}

fs.writeFileSync(
  path.join(utilsDir, 'package.json'),
  JSON.stringify(utilsPackageJson, null, 2) + '\n',
);
console.log('Created utils/package.json');

console.log('Adding PURE annotations to React.forwardRef calls...');
processJSFiles(esmDir);
console.log('Finished adding PURE annotations.');
