import type {
  NormalizedOutputOptions,
  RollupConfigOptions,
} from 'src/defineRollupConfig.mjs';

export type OutputFormat = 'esm' | 'mjs' | 'cjs' | 'umd' | 'browser';

const outputFormats: OutputFormat[] = ['esm', 'mjs', 'cjs', 'umd', 'browser'];

export const normalizeOutputOptions = (
  options: Pick<RollupConfigOptions, 'globals' | 'outputs'>,
): Record<OutputFormat, NormalizedOutputOptions> =>
  outputFormats.reduce(
    (acc, format) => {
      const outputOptions = options.outputs?.[format];
      if (outputOptions === false) {
        return {...acc, [format]: {skip: true}};
      }
      const {file, globals = options.globals} = outputOptions ?? {};
      return {
        ...acc,
        [format]: {
          skip: false,
          globals,
          file,
          external: globals ? Object.keys(globals) : undefined,
        },
      };
    },
    {} as Record<OutputFormat, NormalizedOutputOptions>,
  );
