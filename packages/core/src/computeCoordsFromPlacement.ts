import type {Coords, ElementRects, Placement} from '@floating-ui/utils';
import {
  getAlignment,
  getAlignmentAxis,
  getAxisLength,
  getSide,
  getSideAxis,
} from '@floating-ui/utils';

export function computeCoordsFromPlacement(
  {reference, floating}: ElementRects,
  placement: Placement,
  rtl?: boolean,
): Coords {
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const sideLength = getAxisLength(sideAxis);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;

  return {
    [sideAxis]:
      side === 'top' || side === 'left'
        ? reference[sideAxis] - floating[sideLength]
        : reference[sideAxis] + reference[sideLength],
    [alignmentAxis]:
      reference[alignmentAxis] +
      reference[alignLength] / 2 -
      floating[alignLength] / 2 +
      (alignment
        ? commonAlign *
          (alignment === 'end' ? 1 : -1) *
          (rtl && sideAxis === 'y' ? -1 : 1)
        : 0),
  } as Coords;
}
