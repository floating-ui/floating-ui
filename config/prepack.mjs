import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://github.com/rolldown/tsdown/issues/257
function addPureAnnotations(content) {
  const lines = content.split('\n');
  const updatedLines = lines.map((line) => {
    if (line.includes('React.forwardRef(')) {
      if (line.includes('/* @__PURE__ */')) {
        return line;
      }
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
          `Added PURE annotations to: ${path.relative(dir, filePath)}`,
        );
      }
    }
  }
}

function createPackageJson(dir, type) {
  const packageJson = {type};

  if (fs.existsSync(dir)) {
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(packageJson, null, 2) + '\n',
    );
    console.log(
      `Created package.json in ${path.relative(
        process.cwd(),
        dir,
      )} with type: ${type}`,
    );
  }
}

function createUtilsPackageJson(rootDir) {
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
}

function main() {
  const packageName = process.argv[2];
  const options = process.argv.slice(3);

  if (!packageName) {
    console.error(
      'Usage: node config/prepack.mjs <package-name> [--utils] [--react-pure]',
    );
    process.exit(1);
  }

  const hasUtils = options.includes('--utils');
  const needsReactPure = options.includes('--react-pure');

  const packageDir = path.join(__dirname, '..', 'packages', packageName);
  const distDir = path.join(packageDir, 'dist');
  const cjsDir = path.join(distDir, 'cjs');
  const esmDir = path.join(distDir, 'esm');

  createPackageJson(cjsDir, 'commonjs');
  createPackageJson(esmDir, 'module');

  if (hasUtils) {
    createUtilsPackageJson(packageDir);
  }

  if (needsReactPure) {
    console.log('Adding PURE annotations to React.forwardRef calls...');
    processJSFiles(esmDir);
    console.log('Finished adding PURE annotations.');
  }
}

main();
