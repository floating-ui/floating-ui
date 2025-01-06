import type {ClientRectObject} from '@floating-ui/core';

export function rectsAreEqual(a: ClientRectObject, b: ClientRectObject) {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}
