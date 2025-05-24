import ts from 'typescript';

export function addPureAnnotations() {
  return {
    name: 'add-pure-annotations',
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

      // only annotate when the call/new is the RHS of a top-level assignment/export
      const isAssignmentContext = (node: ts.Expression): boolean => {
        const p = node.parent;
        if (!p) return false;
        switch (p.kind) {
          case ts.SyntaxKind.VariableDeclaration:
            return (p as ts.VariableDeclaration).initializer === node;
          case ts.SyntaxKind.BinaryExpression: {
            const be = p as ts.BinaryExpression;
            return (
              be.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
              be.right === node
            );
          }
          case ts.SyntaxKind.ExportAssignment:
            return (p as ts.ExportAssignment).expression === node;
          default:
            return false;
        }
      };

      // skip anything inside a function
      const isInFunction = (n: ts.Node): boolean => {
        let cur = n.parent;
        while (cur && cur.kind !== ts.SyntaxKind.SourceFile) {
          if (ts.isFunctionLike(cur)) return true;
          cur = cur.parent;
        }
        return false;
      };

      // don’t double-annotate
      const hasPureComment = (node: ts.Node): boolean => {
        return !!ts
          .getLeadingCommentRanges(code, node.pos)
          ?.some((r) => code.slice(r.pos, r.end).includes('__PURE__'));
      };

      const transformer: ts.TransformerFactory<ts.SourceFile> = (ctx) => {
        const visit: ts.Visitor = (node) => {
          if (
            (ts.isCallExpression(node) || ts.isNewExpression(node)) &&
            !isInFunction(node) &&
            isAssignmentContext(node) &&
            !hasPureComment(node)
          ) {
            changed = true;
            return ts.addSyntheticLeadingComment(
              node,
              ts.SyntaxKind.MultiLineCommentTrivia,
              '#__PURE__',
              /* hasTrailingNewLine */ false,
            );
          }
          return ts.visitEachChild(node, visit, ctx);
        };

        return (sf) => {
          const out = ts.visitNode(sf, visit);
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
