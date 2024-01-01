#!/usr/bin/env node

//@ts-check
import * as process from 'node:process';

import {fileURLToPath} from 'url';
import {chalk, echo, fs, path} from 'zx';

const rootPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

/**
 * @typedef {{types: string, module: string, default: string}} ExportObject
 * @typedef {ExportObject | string} Export
 * @typedef {{exports?: Record<string, Export>}} PackageJson
 */

/**
 * @type {PackageJson}}
 */
const {exports} = await fs.readJSON('./package.json');

if (!exports) process.exit(0);

await assertExportFilesExists(exports);
for (const [key, expt] of Object.entries(exports)) {
  if (path.extname(key) || typeof expt === 'string' || key === '.') continue;
  const {default: main, module, types} = expt;
  await fs.mkdirp(key);
  await Promise.all([
    fs.copyFile(main, `${key}/${path.basename(main)}`),
    fs.copyFile(module, `${key}/${path.basename(module)}`),
    fs.copyFile(types, `${key}/${path.basename(types)}`),
    fs.writeJson(
      `${key}/package.json`,
      {
        sideEffects: false,
        main: path.basename(main),
        module: path.basename(module),
        types: path.basename(types),
      },
      {spaces: 2},
    ),
  ]);
}

/**
 * @param {Record<string, Export>} exports
 */
async function assertExportFilesExists(exports) {
  const missingFiles = await Promise.all(
    Object.values(exports).map((expt) => getMissingFiles(expt)),
  ).then((files) => files.flat());
  if (missingFiles.length > 0) {
    echo(`
Missing files:

  ${chalk.greenBright(missingFiles.join('\n  '))}

${chalk.redBright('Did you forget to build?')} (${chalk.cyan.bgGray(
      'pnpm run prepack',
    )} from the root directory)
`);
    process.exit(1);
  }
}

/**
 * @param {Export} expt
 * @returns {Promise<string[]>}
 */
async function getMissingFiles(expt) {
  if (typeof expt === 'string') return [];
  return Promise.all([
    fs.exists(expt.default),
    fs.exists(expt.module),
    fs.exists(expt.types),
  ]).then(([main, module, types]) =>
    [
      !main && path.relative(rootPath, expt.default),
      !module && path.relative(rootPath, expt.module),
      !types && path.relative(rootPath, expt.types),
    ].filter(
      /** @type {(value: string | false) => value is string} */ (
        (value) => Boolean(value)
      ),
    ),
  );
}
