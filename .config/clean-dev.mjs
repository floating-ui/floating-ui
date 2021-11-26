import { globbySync } from 'globby';
import rimraf from 'rimraf';

globbySync([
  'packages/**/src/**/*.ts',
  'packages/**/*.js.flow',
  '!packages/*/index.d.ts',
]).forEach((path) => {
  rimraf.sync(path);
});
