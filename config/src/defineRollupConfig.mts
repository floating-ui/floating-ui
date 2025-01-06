import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import type {
  ExternalOption,
  GlobalsOption,
  Plugin,
  RollupOptions,
} from 'rollup';

import {
  type OutputFormat,
  normalizeOutputOptions,
} from './utils/outputFormat.mjs';

export type OutputOptionsObject = {
  globals?: GlobalsOption;
  file?: string;
};

export type OutputOptions = OutputOptionsObject | false;

export type NormalizedOutputOptions = OutputOptionsObject & {
  skip: boolean;
  external?: ExternalOption;
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
  outputs?: Partial<Record<OutputFormat, OutputOptions>>;
};

export const defineRollupConfig = (
  configOptions: RollupConfigOptions,
): RollupOptions[] => {
  const outputOptions = normalizeOutputOptions(configOptions);
  return configOptions.input.flatMap(
    ({name, path: inputPath, globalVariableName}): RollupOptions[] => {
      const rollupOptionsByOutputFormat: Record<
        OutputFormat,
        RollupOptions[] | RollupOptions
      > = {
        esm: {
          input: inputPath,
          output: {
            file: outputOptions.esm.file ?? `./dist/floating-ui.${name}.esm.js`,
            format: 'esm',
          },
          external: outputOptions.esm.external,
          plugins: [
            replace({
              __DEV__: 'process.env.NODE_ENV !== "production"',
              preventAssignment: true,
            }),
            ...commonPlugins({...configOptions, jsxRuntime: true}),
          ],
        },
        mjs: {
          input: inputPath,
          output: {
            file: outputOptions.mjs.file ?? `./dist/floating-ui.${name}.mjs`,
            format: 'esm',
          },
          external: outputOptions.mjs.external,
          plugins: [
            replace({
              __DEV__: 'process.env.NODE_ENV !== "production"',
              preventAssignment: true,
            }),
            ...commonPlugins({...configOptions, jsxRuntime: true}),
          ],
        },
        cjs: {
          input: inputPath,
          output: {
            name: globalVariableName,
            file: outputOptions.cjs.file ?? `./dist/floating-ui.${name}.cjs`,
            globals: outputOptions.cjs.globals,
            format: 'cjs',
          },
          external: outputOptions.cjs.external,
          plugins: [
            replace({
              __DEV__: 'process.env.NODE_ENV !== "production"',
              preventAssignment: true,
            }),
            ...commonPlugins(configOptions),
          ],
        },
        umd: [
          {
            input: inputPath,
            output: {
              name: globalVariableName,
              file:
                outputOptions.umd.file ?? `./dist/floating-ui.${name}.umd.js`,
              format: 'umd',
              globals: outputOptions.umd.globals,
            },
            external: outputOptions.umd.external,
            plugins: [
              replace({
                __DEV__: 'true',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          {
            input: inputPath,
            output: {
              name: globalVariableName,
              file:
                outputOptions.umd.file ??
                `./dist/floating-ui.${name}.umd.min.js`,
              format: 'umd',
              globals: outputOptions.umd.globals,
            },
            external: outputOptions.umd.external,
            plugins: [
              replace({
                __DEV__: 'false',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
              terser(),
            ],
          },
        ],
        browser: [
          {
            input: inputPath,
            output: {
              file:
                outputOptions.browser.file ??
                `./dist/floating-ui.${name}.browser.mjs`,
              format: 'esm',
            },
            external: outputOptions.browser.external,
            plugins: [
              replace({
                __DEV__: 'true',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
            ],
          },
          {
            input: inputPath,
            output: {
              file:
                outputOptions.browser.file ??
                `./dist/floating-ui.${name}.browser.min.mjs`,
              format: 'esm',
            },
            external: outputOptions.browser.external,
            plugins: [
              replace({
                __DEV__: 'false',
                preventAssignment: true,
              }),
              ...commonPlugins(configOptions),
              terser(),
            ],
          },
        ],
      };

      return strictlyTypedEntries(rollupOptionsByOutputFormat).flatMap(
        ([key, value]) => (outputOptions[key].skip ? [] : value),
      );
    },
  );
};

/**
 * Explicitly typed version of Object.entries.
 */
const strictlyTypedEntries = Object.entries as <T extends object>(
  o: T,
) => {[K in keyof T]: [K, T[K]]}[keyof T][];

const commonPlugins = (
  configOptions: RollupConfigOptions & {jsxRuntime?: boolean},
): Plugin[] => {
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
        presets: configOptions.jsxRuntime
          ? [['@babel/react', {runtime: 'automatic'}]]
          : [],
        plugins: ['annotate-pure-calls'],
      }),
  ];
};
