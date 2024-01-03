import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import type {GlobalsOption, Plugin, RollupOptions} from 'rollup';

import {
  type OutputFormat,
  externalFromOutputFormat,
  globalsFromOutputFormat,
  outputFormatFromFileName,
} from './utils/outputFormat.mjs';

export type OutputOptions = {
  globals?: GlobalsOption;
};

export type RollupConfigOptions = {
  input: {
    name: string;
    path: string;
    globalVariableName: string;
  }[];
  plugins?: {
    nodeResolve?: Plugin;
    babel?: Plugin;
    [K: string]: Plugin | undefined;
  };
  globals?: GlobalsOption;
  outputs?: Partial<Record<OutputFormat, OutputOptions | false>>;
};

export const defineRollupConfig = (
  configOptions: RollupConfigOptions,
): RollupOptions[] =>
  configOptions.input.flatMap(
    ({name, path: inputPath, globalVariableName}): RollupOptions[] =>
      (
        [
          // ESM
          {
            input: inputPath,
            output: {
              file: `./dist/floating-ui.${name}.esm.js`,
              format: 'esm',
            },
            external: externalFromOutputFormat('esm', configOptions),
            plugins: [
              replace({
                __DEV__: 'process.env.NODE_ENV !== "production"',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          // MJS
          {
            input: inputPath,
            output: {
              file: `./dist/floating-ui.${name}.mjs`,
              format: 'esm',
            },
            external: externalFromOutputFormat('mjs', configOptions),
            plugins: [
              replace({
                __DEV__: 'process.env.NODE_ENV !== "production"',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          // CJS
          {
            input: inputPath,
            output: {
              name: globalVariableName,
              file: `./dist/floating-ui.${name}.cjs`,
              globals: globalsFromOutputFormat('cjs', configOptions),
              format: 'cjs',
            },
            external: externalFromOutputFormat('cjs', configOptions),
            plugins: [
              replace({
                __DEV__: 'process.env.NODE_ENV !== "production"',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          // UMD
          {
            input: inputPath,
            output: {
              name: globalVariableName,
              file: `./dist/floating-ui.${name}.umd.js`,
              format: 'umd',
              globals: globalsFromOutputFormat('umd', configOptions),
            },
            external: externalFromOutputFormat('umd', configOptions),
            plugins: [
              replace({
                __DEV__: 'true',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          // UMD min
          {
            input: inputPath,
            output: {
              name: globalVariableName,
              file: `./dist/floating-ui.${name}.umd.min.js`,
              format: 'umd',
              globals: globalsFromOutputFormat('umd', configOptions),
            },
            external: externalFromOutputFormat('umd', configOptions),
            plugins: [
              replace({
                __DEV__: 'false',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
              terser(),
            ],
          },
          // Browser
          {
            input: inputPath,
            output: {
              file: `./dist/floating-ui.${name}.browser.mjs`,
              format: 'esm',
            },
            external: externalFromOutputFormat('browser', configOptions),
            plugins: [
              replace({
                __DEV__: 'true',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          // Browser min
          {
            input: inputPath,
            output: {
              file: `./dist/floating-ui.${name}.browser.min.mjs`,
              format: 'esm',
            },
            external: externalFromOutputFormat('browser', configOptions),
            plugins: [
              replace({
                __DEV__: 'false',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
              terser(),
            ],
          },
        ] satisfies RollupOptions[]
      ).filter(filterRollupOptions(configOptions)),
  );

const filterRollupOptions =
  (configOptions: RollupConfigOptions) =>
  (rollupOptions: {output: {file: string}}) =>
    Boolean(
      configOptions.outputs?.[
        outputFormatFromFileName(rollupOptions.output.file)
      ] ?? true,
    );

const commonPlugins = (configOptions: RollupConfigOptions): Plugin[] => {
  const {
    nodeResolve: nodeResolveOverride,
    babel: babelOverride,
    ...rest
  } = configOptions.plugins ?? {};
  return [
    ...Object.values(rest).filter((plugin): plugin is Plugin =>
      Boolean(plugin),
    ),
    nodeResolveOverride ?? nodeResolve({extensions: ['.ts', '.tsx']}),
    babelOverride ??
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        plugins: ['annotate-pure-calls'],
      }),
  ];
};
