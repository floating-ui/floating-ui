import { globbySync } from 'globby';
import rimraf from 'rimraf';

globbySync(['packages/**/src/**/*.ts', '!packages/**/*.d.ts']).forEach(
  (path) => {
    rimraf.sync(path);
  }
);
