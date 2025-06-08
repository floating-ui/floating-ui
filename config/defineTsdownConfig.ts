import {defineConfig} from 'tsdown';
import {addPureAnnotations} from './addPureAnnotations';
import {stripPlatformAwait} from './stripPlatformAwait';

export interface TsdownConfigOptions {
  external?: string[];
  define?: Record<string, string>;
  entry?: string[];
  sync?: boolean;
}

export function defineTsdownConfig(options: TsdownConfigOptions = {}) {
  const {external = [], define, entry = ['./src'], sync = false} = options;

  const plugins = [addPureAnnotations()];
  if (sync) {
    plugins.push(stripPlatformAwait());
  }

  const common = {
    entry,
    external,
    unbundle: true,
    plugins,
    define: {
      __DEV__: 'process.env.NODE_ENV !== "production"',
      ...define,
    },
  };

  if (sync) {
    // Sync builds go to the default dist/ folders
    // Async builds go to async/ subfolders
    const asyncPlugins = [addPureAnnotations()];
    const asyncCommon = {
      ...common,
      plugins: asyncPlugins,
    };

    return [
      defineConfig({...common, format: 'cjs', outDir: 'dist/cjs'}),
      defineConfig({
        ...common,
        format: 'esm',
        outDir: 'dist/esm',
        outExtensions: () => ({js: '.js'}),
      }),
      defineConfig({...asyncCommon, format: 'cjs', outDir: 'dist/async/cjs'}),
      defineConfig({
        ...asyncCommon,
        format: 'esm',
        outDir: 'dist/async/esm',
        outExtensions: () => ({js: '.js'}),
      }),
    ];
  }

  return [
    defineConfig({...common, format: 'cjs', outDir: 'dist/cjs'}),
    defineConfig({
      ...common,
      format: 'esm',
      outDir: 'dist/esm',
      outExtensions: () => ({js: '.js'}),
    }),
  ];
}
