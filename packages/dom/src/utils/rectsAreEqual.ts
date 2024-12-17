export function rectsAreEqual(a: DOMRect, b: DOMRect) {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}
