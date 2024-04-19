#!/usr/bin/env node

//@ts-check
import {glob} from 'glob';
import minimist from 'minimist';
import {$, chalk, echo, fs} from 'zx';

/**
 * @template {string} Keys
 * @typedef {{[K in Keys]: string | string[]} & { _: never[]; }} ParseArgs<Keys>
 */

const args = /** @type {ParseArgs<'tsc'| 'aec'>} */ (
  minimist(process.argv.slice(2), {
    default: {
      tsc: './tsconfig.json',
      aec: './api-extractor.json',
    },
  })
);

const tscPaths = await glob(args.tsc);
const aecPaths = await glob(args.aec);

echo(
  chalk.cyan(
    `TS Configuration${tscPaths.length > 1 ? 's' : ''}: ${chalk.greenBright(
      tscPaths.join(', '),
    )}`,
  ),
);
echo(
  chalk.cyan(
    `API Extractor configuration${
      aecPaths.length > 1 ? 's' : ''
    }: ${chalk.greenBright(aecPaths.join(chalk.gray(', ')))}`,
  ),
);

echo('');

echo(chalk.cyan(`Running tsc (${chalk.greenBright(tscPaths.join(', '))})`));

await Promise.all(tscPaths.map((tscPath) => $`npx tsc -b ${tscPath}`));

echo(
  chalk.cyan(
    `Running API Extractor (${chalk.greenBright(aecPaths.join(', '))})`,
  ),
);

await Promise.all(
  aecPaths.map(async (aecPath) => {
    await $`npx api-extractor run --local --verbose -c ${aecPath}`;
    const configFile = await fs.readJson(aecPath);
    if (configFile.dtsRollup?.untrimmedFilePath) {
      const path = configFile.dtsRollup.untrimmedFilePath.replace(
        '<projectFolder>',
        configFile.projectFolder ?? '.',
      );
      echo(
        chalk.cyan(
          `Replacing "React_2" for "React" from ${chalk.greenBright(path)}`,
        ),
      );
      const dtsFile = await fs.readFile(path, 'utf-8');
      await fs.writeFile(path, dtsFile.replace(/React_2/g, 'React'));

      const mdtsPath = path.replace(/\.d\.ts$/, '.d.mts');
      echo(
        chalk.cyan(
          `Copying ${chalk.greenBright(path)} into ${chalk.greenBright(
            mdtsPath,
          )}`,
        ),
      );
      await fs.copyFile(path, mdtsPath);
    }
  }),
);
