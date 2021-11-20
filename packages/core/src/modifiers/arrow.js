// @flow
import type { Placement } from '../enums';
import type { Modifier, ModifierArguments, Padding, Rect, Obj } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import within from '../utils/within';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { left, right, basePlacements, top, bottom } from '../enums';
import isVerticalPlacement from '../utils/isVerticalPlacement';

export type Options = {
  element: Obj,
  padding:
    | Padding
    | (({|
        popper: Rect,
        reference: Rect,
        placement: Placement,
      |}) => Padding),
};

const toPaddingObject = (padding, rects, placement) => {
  padding =
    typeof padding === 'function' ? padding({ ...rects, placement }) : padding;

  return mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );
};

export const arrow = ({ element, padding }: Options): Modifier => ({
  name: 'arrow',
  async fn(modifierArguments: ModifierArguments) {
    const { placement, rects, coords, platform } = modifierArguments;

    const basePlacement = getBasePlacement(placement);
    const axis = getMainAxisFromPlacement(basePlacement);
    const isVerticalOffset = !isVerticalPlacement(placement);
    const len = isVerticalOffset ? 'height' : 'width';
    const paddingObject = toPaddingObject(padding, rects, placement);
    const arrowRect = await platform.getDimensions({ element });
    const minProp = axis === 'y' ? top : left;
    const maxProp = axis === 'y' ? bottom : right;

    const endDiff =
      rects.reference[len] +
      rects.reference[axis] -
      coords[axis] -
      rects.popper[len];
    const startDiff = coords[axis] - rects.reference[axis];

    const arrowOffsetParent = await platform.getOffsetParent({ element });
    const clientSize = arrowOffsetParent
      ? axis === 'y'
        ? arrowOffsetParent.clientHeight || 0
        : arrowOffsetParent.clientWidth || 0
      : 0;

    const centerToReference = endDiff / 2 - startDiff / 2;

    // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds
    const min = paddingObject[minProp];
    const max = clientSize - arrowRect[len] - paddingObject[maxProp];
    const center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    const offset = within(min, center, max);

    const axisProp: string = axis;
    return {
      ...coords,
      data: {
        [axisProp]: offset,
        centerOffset: center - offset,
      },
    };
  },
});
