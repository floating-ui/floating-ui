import ts from 'typescript';

export function stripPlatformAwait() {
  return {
    name: 'strip-platform-await',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return null;

      const scriptKind =
        id.endsWith('.tsx') || id.endsWith('.jsx')
          ? ts.ScriptKind.TSX
          : ts.ScriptKind.TS;

      const source = ts.createSourceFile(
        id,
        code,
        ts.ScriptTarget.ESNext,
        /* setParentNodes */ true,
        scriptKind,
      );

      let changed = false;

      const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
        const visitor: ts.Visitor = (node) => {
          // Remove all await expressions
          if (ts.isAwaitExpression(node)) {
            changed = true;
            // Return the expression without the await
            return ts.visitNode(node.expression, visitor);
          }

          // Remove async keyword from arrow functions in variable declarations
          if (
            ts.isVariableDeclaration(node) &&
            node.initializer &&
            ts.isArrowFunction(node.initializer)
          ) {
            const arrowFunc = node.initializer;
            if (
              arrowFunc.modifiers?.some(
                (mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
              )
            ) {
              changed = true;
              const newModifiers = arrowFunc.modifiers.filter(
                (mod) => mod.kind !== ts.SyntaxKind.AsyncKeyword,
              );
              const newArrowFunc = ts.factory.updateArrowFunction(
                arrowFunc,
                newModifiers.length > 0
                  ? (newModifiers as ts.Modifier[])
                  : undefined,
                arrowFunc.typeParameters,
                arrowFunc.parameters,
                arrowFunc.type,
                arrowFunc.equalsGreaterThanToken,
                ts.visitNode(arrowFunc.body, visitor) as ts.ConciseBody,
              );
              return ts.factory.updateVariableDeclaration(
                node,
                node.name,
                node.exclamationToken,
                node.type,
                newArrowFunc,
              );
            }
          }

          // Remove async keyword from function declarations
          if (
            ts.isFunctionDeclaration(node) &&
            node.modifiers?.some(
              (mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
            )
          ) {
            changed = true;
            const newModifiers = node.modifiers.filter(
              (mod) => mod.kind !== ts.SyntaxKind.AsyncKeyword,
            );
            return ts.factory.updateFunctionDeclaration(
              node,
              newModifiers.length > 0
                ? (newModifiers as ts.Modifier[])
                : undefined,
              node.asteriskToken,
              node.name,
              node.typeParameters,
              node.parameters,
              node.type,
              node.body
                ? (ts.visitNode(node.body, visitor) as ts.Block)
                : undefined,
            );
          }

          // Remove async keyword from method declarations
          if (
            ts.isMethodDeclaration(node) &&
            node.modifiers?.some(
              (mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
            )
          ) {
            changed = true;
            const newModifiers = node.modifiers.filter(
              (mod) => mod.kind !== ts.SyntaxKind.AsyncKeyword,
            );
            return ts.factory.updateMethodDeclaration(
              node,
              newModifiers.length > 0
                ? (newModifiers as ts.Modifier[])
                : undefined,
              node.asteriskToken,
              node.name,
              node.questionToken,
              node.typeParameters,
              node.parameters,
              node.type,
              node.body
                ? (ts.visitNode(node.body, visitor) as ts.Block)
                : undefined,
            );
          }

          return ts.visitEachChild(node, visitor, context);
        };

        return (sf) => {
          const out = ts.visitNode(sf, visitor);
          return (out as ts.SourceFile) || sf;
        };
      };

      const result = ts.transform(source, [transformer]);

      if (!changed) {
        return null;
      }

      const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
        removeComments: false,
      });

      return {
        code: printer.printFile(result.transformed[0]),
        map: null,
      };
    },
  };
}
