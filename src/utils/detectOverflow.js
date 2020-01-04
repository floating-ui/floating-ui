// @flow
import type { State, SideObject } from '../types';
import type { Placement, Boundary, RootBoundary, Context } from '../enums';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingRect from '../dom-utils/getClippingRect';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';
import computeOffsets from '../utils/computeOffsets';
import rectToClientRect from '../utils/rectToClientRect';
import {
  clippingParents,
  reference,
  popper,
  bottom,
  top,
  right,
} from '../enums';

type Options = {
  placement: Placement,
  boundary: Boundary,
  rootBoundary: RootBoundary,
  elementContext: Context,
  altBoundary: boolean,
};

export default function detectOverflow(
  state: State,
  options: $Shape<Options> = {}
): SideObject {
  const {
    placement = state.placement,
    boundary = clippingParents,
    rootBoundary = 'document',
    elementContext = popper,
    altBoundary = false,
  } = options;

  const altContext = elementContext === popper ? reference : popper;

  const referenceElement = state.elements.reference;
  const popperRect = state.rects.popper;
  const element = state.elements[altBoundary ? altContext : elementContext];

  const clippingClientRect = getClippingRect(
    unwrapVirtualElement(element),
    boundary,
    rootBoundary
  );
  const referenceClientRect = getBoundingClientRect(referenceElement);

  const popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement,
  });

  const popperClientRect = rectToClientRect({
    ...popperRect,
    ...popperOffsets,
  });

  const elementClientRect =
    elementContext === popper ? popperClientRect : referenceClientRect;

  // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect
  const overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom,
    left: clippingClientRect.left - elementClientRect.left,
    right: elementClientRect.right - clippingClientRect.right,
  };

  const offsetData = state.modifiersData.offset;

  // Offsets can be applied only to the popper element
  if (elementContext === popper && offsetData) {
    const offset = offsetData[placement];

    Object.keys(overflowOffsets).forEach(key => {
      const multiply = [right, bottom].includes(key) ? 1 : -1;
      const axis = [top, bottom].includes(key) ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}
