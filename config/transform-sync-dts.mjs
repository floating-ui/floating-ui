import fs from 'fs/promises';
import path from 'path';
import {glob} from 'glob';
import ts from 'typescript';

function createTransformer() {
  return (context) => {
    return (sourceFile) => {
      function visit(node) {
        // Remove StrippablePromise type alias declaration
        if (
          ts.isTypeAliasDeclaration(node) &&
          node.name.text === 'StrippablePromise'
        ) {
          return undefined; // Remove the node
        }

        // Remove StrippablePromise from import statements
        if (ts.isImportDeclaration(node) && node.importClause) {
          if (
            node.importClause.namedBindings &&
            ts.isNamedImports(node.importClause.namedBindings)
          ) {
            const filteredElements =
              node.importClause.namedBindings.elements.filter(
                (element) => element.name.text !== 'StrippablePromise',
              );

            if (filteredElements.length === 0) {
              return undefined; // Remove entire import if no elements left
            }

            if (
              filteredElements.length !==
              node.importClause.namedBindings.elements.length
            ) {
              return ts.factory.updateImportDeclaration(
                node,
                node.modifiers,
                ts.factory.updateImportClause(
                  node.importClause,
                  false,
                  node.importClause.name,
                  ts.factory.createNamedImports(filteredElements),
                ),
                node.moduleSpecifier,
                node.attributes,
              );
            }
          }
        }

        // Transform StrippablePromise<T> type references to T
        if (
          ts.isTypeReferenceNode(node) &&
          ts.isIdentifier(node.typeName) &&
          node.typeName.text === 'StrippablePromise'
        ) {
          // Return the first type argument (T)
          if (node.typeArguments && node.typeArguments.length > 0) {
            return node.typeArguments[0];
          }
          // Fallback to 'any' if no type arguments
          return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(sourceFile, visit);
    };
  };
}

function removeStrippablePromiseFromExports(sourceFile) {
  return ts.transform(sourceFile, [
    (context) => (sourceFile) => {
      function visit(node) {
        // Handle export declarations
        if (
          ts.isExportDeclaration(node) &&
          node.exportClause &&
          ts.isNamedExports(node.exportClause)
        ) {
          const filteredElements = node.exportClause.elements.filter(
            (element) => element.name.text !== 'StrippablePromise',
          );

          if (filteredElements.length === 0) {
            return undefined; // Remove empty export
          }

          if (filteredElements.length !== node.exportClause.elements.length) {
            return ts.factory.updateExportDeclaration(
              node,
              node.modifiers,
              false,
              ts.factory.createNamedExports(filteredElements),
              node.moduleSpecifier,
              node.attributes,
            );
          }
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(sourceFile, visit);
    },
  ]);
}

async function transformFile(filePath) {
  const originalContent = await fs.readFile(filePath, 'utf-8');

  // Skip files that don't have StrippablePromise
  if (!originalContent.includes('StrippablePromise')) {
    return;
  }

  // Parse the file
  const sourceFile = ts.createSourceFile(
    filePath,
    originalContent,
    ts.ScriptTarget.Latest,
    true,
  );

  // Transform the AST
  const result = ts.transform(sourceFile, [createTransformer()]);
  const transformedSourceFile = result.transformed[0];

  // Remove StrippablePromise from exports
  const exportResult = removeStrippablePromiseFromExports(
    transformedSourceFile,
  );
  const finalSourceFile = exportResult.transformed[0];

  // Generate the new content
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  const newContent = printer.printFile(finalSourceFile);

  // Clean up
  result.dispose();
  exportResult.dispose();

  if (originalContent !== newContent) {
    console.log(`Transformed ${path.basename(filePath)}`);
    await fs.writeFile(filePath, newContent, 'utf-8');
  }
}

async function main() {
  const packageDir = process.cwd();
  const distDir = path.join(packageDir, 'dist');

  const dtsFiles = await glob('**/*.d.ts', {
    cwd: distDir,
    absolute: true,
    ignore: ['**/async/**'],
  });

  await Promise.all(dtsFiles.map(transformFile));

  console.log('Finished transforming .d.ts files to sync versions.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
