#!/usr/bin/env node

//@ts-check
import {chalk, fs, path} from 'zx';

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

for (const [key, expt] of Object.entries(exports)) {
  if (path.extname(key) || typeof expt === 'string' || key === '.') continue;
  const {default: main, module, types} = expt;
  await assertExportFilesExists(expt);
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
 * @param {ExportObject} exportsObject
 */
async function assertExportFilesExists({default: main, module, types}) {
  const exists = await Promise.all([
    fs.exists(main),
    fs.exists(module),
    fs.exists(types),
  ]).then(([main, module, types]) => main && module && types);
  if (!exists) {
    throw new Error(`
    Missing either:
    ${chalk.greenBright(main)}
    ${chalk.greenBright(module)}
    ${chalk.greenBright(types)}
    ${chalk.redBright('Did you forget to build?')}
    `);
  }
}
