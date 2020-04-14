// @noflow

/**
 * This script type checks all the .ts files in the `src` folder and
 * prepends each error with a // @ts-ignore comment, so that we are
 * able to generate a .d.ts file from the source code.
 */

const ts = require('typescript');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const arg = require('arg');

const convertToMultiplePatternMatching = array =>
  array.length > 1 ? `{${array.join(',')}}` : array[0];

const tsnocheck = '// @ts-nocheck\n';

const args = arg({
  '--project': String,
  '--outDir': String,
  '--verbose': Boolean,
});

const tsconfig = require(path.join(process.cwd(), args['--project']));
const tsconfigPath = path.dirname(path.join(process.cwd(), args['--project']));

/**
 * TypeScript-specific types can be defined inside /*;;  comment blocks
 */
const createSourceFile = ts.createSourceFile;
ts.createSourceFile = (fileName, text, languageVersion, setParentNodes) => {
  text = text.replace(/\/\*;;([\s\S]+?)\*\//gm, '$1');
  text = text.replace(/\/\*;(.+?)\*\//gm, ':$1');

  return createSourceFile(fileName, text, languageVersion, setParentNodes);
};

function compile(fileNames, options) {
  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName, contents) =>
    fs.writeFileSync(fileName, contents, {
      encoding: 'utf8',
    });

  // Prepare and emit the d.ts files
  const program = ts.createProgram(fileNames, options, host);
  const emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const alteredFiles = [];

  allDiagnostics.forEach(diagnostic => {
    const fileName = diagnostic.file && diagnostic.file.fileName;
    if (args['--verbose']) {
      console.log(
        fileName,
        '\n',
        typeof diagnostic.messageText !== 'string'
          ? diagnostic.messageText.messageText
          : diagnostic.messageText,
        '\n\n'
      );
    }
    if (!fileName) return;
    if (alteredFiles.includes(fileName)) {
      return;
    }

    let source = fs.readFileSync(fileName, 'utf8');
    const output = `${tsnocheck}${source}`;
    fs.writeFileSync(fileName, output, { encoding: 'utf8' });

    alteredFiles.push(fileName);
  });

  if (alteredFiles.length) {
    console.info(`Ignored ${alteredFiles.length} type errors.`);
  }
}

// Run the compiler
glob(
  convertToMultiplePatternMatching(
    tsconfig.include.map(p =>
      path.relative(process.cwd(), path.join(tsconfigPath, p))
    )
  ),
  {
    ignore: convertToMultiplePatternMatching(
      tsconfig.exclude.map(p =>
        path.relative(process.cwd(), path.join(tsconfigPath, p))
      )
    ),
  },
  (err, files) => {
    compile(
      files,
      {
        declaration: true,
        emitDeclarationOnly: true,
        project: path.resolve(args['--project']),
        outDir: path.resolve(args['--outDir']),
      },
      true
    );

    console.info('Definitions files have been saved in destination folder');
  }
);
