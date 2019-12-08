// @noflow

/**
 * This script type checks all the .ts files in the `src` folder and
 * prepends each error with a // @ts-ignore comment, so that we are
 * able to generate a .d.ts file from the source code.
 */

const ts = require('typescript');
const glob = require('glob');
const fs = require('fs');

const tsignore = '\n// @ts-ignore';

function compile(fileNames, options) {
  // Create a Program with an in-memory emit
  const createdFiles = {};
  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents);

  // Prepare and emit the d.ts files
  const program = ts.createProgram(fileNames, options, host);
  const emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const alteredFiles = [];

  allDiagnostics.forEach(diagnostic => {
    const fileName = diagnostic.file.fileName;
    let start = diagnostic.start;

    if (alteredFiles.includes(fileName)) {
      start += tsignore.length;
    }

    const source = fs.readFileSync(fileName);
    const pos = source.slice(0, start).lastIndexOf('\n');
    const output = [source.slice(0, pos), tsignore, source.slice(pos)].join('');
    fs.writeFileSync(fileName, output, { encoding: 'utf8' });

    alteredFiles.push(fileName);
  });
}

// Run the compiler
glob('src/**/*.ts', { ignore: '**/*.test.ts' }, (err, files) => {
  compile(files, {
    declaration: true,
    emitDeclarationOnly: true,
    project: require.resolve('./tsconfig.json'),
  });

  // run twice to cover errors that magically appear after we ignore the first batch
  compile(files, {
    declaration: true,
    emitDeclarationOnly: true,
    project: require.resolve('./tsconfig.json'),
  });
});
