import type {ExternalOption, GlobalsOption} from 'rollup';
import type {RollupConfigOptions} from 'src/defineRollupConfig.mjs';

export type OutputFormat = 'esm' | 'mjs' | 'cjs' | 'umd' | 'browser';

const outputFormatByExtension = {
  'esm.js': 'esm',
  mjs: 'mjs',
  cjs: 'cjs',
  'react-native.js': 'cjs',
  'umd.js': 'umd',
  'umd.min.js': 'umd',
  'browser.mjs': 'browser',
  'browser.min.mjs': 'browser',
} satisfies Record<string, OutputFormat>;

const validExtensions = Object.keys(outputFormatByExtension) as Array<
  keyof typeof outputFormatByExtension
>;

export const outputFormatFromFileName = (fileName: string): OutputFormat => {
  const extension = validExtensions.find((ext) => fileName.endsWith(ext));
  if (!extension) {
    throw new Error(
      `Invalid file name ${fileName}.
      File should be named as "floating-ui.<name>.<ext>".
      Valid extensions are ".${Object.keys(outputFormatByExtension).join(
        ', ',
      )}".
      Instead got ".${extension}".
      `,
    );
  }
  return outputFormatByExtension[extension];
};

export const globalsFromOutputFormat = (
  format: OutputFormat,
  options: Pick<RollupConfigOptions, 'globals' | 'outputs'>,
): GlobalsOption =>
  (options?.outputs?.[format] || {})?.globals ?? options?.globals ?? {};

export const externalFromOutputFormat = (
  format: OutputFormat,
  options: Pick<RollupConfigOptions, 'globals' | 'outputs'>,
): ExternalOption => Object.keys(globalsFromOutputFormat(format, options));
