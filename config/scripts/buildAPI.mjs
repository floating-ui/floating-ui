#!/usr/bin/env node

//@ts-check
import {glob} from 'glob';
import minimist from 'minimist';
import {$, fs} from 'zx';

const args = minimist(process.argv.slice(2), {
  default: {
    tsc: './tsconfig.json',
    aec: './api-extractor.json',
  },
});

console.log(`Running tsc (${args.tsc})`);
await $`npx tsc -b ${args.tsc}`;
for (const aec of await glob(args.aec)) {
  console.log(`Running API Extractor (${aec})`);
  await $`npx api-extractor run --local --verbose -c ${aec}`;
  /** @type {import('@microsoft/api-extractor').IConfigFile} */
  const configFile = await fs.readJson(aec);
  if (configFile.dtsRollup?.untrimmedFilePath) {
    const path = configFile.dtsRollup.untrimmedFilePath.replace(
      '<projectFolder>',
      configFile.projectFolder ?? '.',
    );
    const mdtsPath = path.replace(/\.d\.ts$/, '.d.mts');
    console.log(`Copying ${path} into ${mdtsPath}`);
    await $`cp ${path} ${mdtsPath}`;
  }
}
