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

const tsignore = '\n// @ts-ignore';

const args = arg({
  '--project': String,
  '--outDir': String,
});

const tsconfig = require(path.join(process.cwd(), args['--project']));
const tsconfigPath = path.dirname(path.join(process.cwd(), args['--project']));

function compile(fileNames, options, write) {
  let host;
  if (write) {
    host = ts.createCompilerHost(options);
    host.writeFile = (fileName, contents) =>
      fs.writeFileSync(fileName, contents, {
        encoding: 'utf8',
      });
  }

  // Prepare and emit the d.ts files
  const program = ts.createProgram(fileNames, options, host);
  const emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const alteredFiles = [];

  allDiagnostics.forEach(diagnostic => {
    console.log(diagnostic.messageText);
    const fileName = diagnostic.file && diagnostic.file.fileName;
    if (!fileName) return;

    let start = diagnostic.start;

    if (alteredFiles.indexOf(fileName) >= 0) {
      start += tsignore.length;
    }

    let source = fs.readFileSync(fileName, 'utf8');
    source = source.replace(/\/\/ \$FlowFixMe/g, tsignore);
    const pos = source.slice(0, start).lastIndexOf('\n');
    const output = [source.slice(0, pos), tsignore, source.slice(pos)].join('');
    fs.writeFileSync(fileName, output, { encoding: 'utf8' });

    alteredFiles.push(fileName);
  });

  if (alteredFiles.length) {
    console.info(`Ignored ${alteredFiles.length} type errors.`);
  }

  return alteredFiles.length === 0;
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
    let canWrite = false;
    let written = false;
    let loops = 0;
    while (written === false && loops < 10) {
      if (canWrite) {
        written = true;
      }
      loops += 1;
      canWrite = compile(
        files,
        {
          declaration: true,
          emitDeclarationOnly: true,
          project: path.resolve(args['--project']),
          outDir: path.resolve(args['--outDir']),
        },
        canWrite
      );
    }
    if (written) {
      console.info('Definitions files have been saved in destination folder');
    }
  }
);
