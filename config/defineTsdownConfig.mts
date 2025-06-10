import {defineConfig} from 'tsdown';
import {addPureAnnotations} from './addPureAnnotations.mts';

export interface TsdownConfigOptions {
  external?: string[];
  define?: Record<string, string>;
  entry?: string[];
}

export function defineTsdownConfig(options: TsdownConfigOptions = {}) {
  const {external = [], define, entry = ['./src']} = options;

  const common = {
    entry,
    external,
    unbundle: true,
    plugins: [addPureAnnotations()],
    define: {
      __DEV__: 'process.env.NODE_ENV !== "production"',
      ...define,
    },
  };

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
