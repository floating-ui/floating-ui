// @flow
import type { State, ClientRectObject, VirtualElement } from '../types';
import type {
  Placement,
  RootOverflowArea,
  OverflowArea,
  Context,
} from '../enums';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingRect from '../dom-utils/getClippingRect';
import getViewportRect from '../dom-utils/getViewportRect';
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
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';

type Options = {
  placement: Placement,
  area: OverflowArea,
  rootArea: RootOverflowArea,
  elementContext: Context,
  altArea: boolean,
};

// if the number is positive, the popper is overflowing by that number of pixels
// when 0, or negative, the popper is within its boundaries
type OverflowOffsets = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

const getOverflowOffsets = (
  popperClientRect,
  boundaryClientRect
): OverflowOffsets => ({
  top: boundaryClientRect.top - popperClientRect.top,
  bottom: popperClientRect.bottom - boundaryClientRect.bottom,
  left: boundaryClientRect.left - popperClientRect.left,
  right: popperClientRect.right - boundaryClientRect.right,
});

const getOverflowRect = (
  elementOrVirtualElement: Element | VirtualElement,
  area: OverflowArea,
  rootArea: RootOverflowArea
): ClientRectObject => {
  const element = unwrapVirtualElement(elementOrVirtualElement);

  switch (area) {
    case 'clippingParents':
      return getClippingRect(element, rootArea);
    case 'viewport':
      return rectToClientRect(getViewportRect(element));
    default:
      return getBoundingClientRect(area);
  }
};

export default function detectOverflow(
  state: State,
  options: $Shape<Options> = {}
): OverflowOffsets {
  const {
    placement = state.placement,
    area = clippingParents,
    rootArea = 'document',
    elementContext = popper,
    altArea = false,
  } = options;

  const altContext = elementContext === popper ? reference : popper;

  const referenceElement = state.elements.reference;
  const popperRect = state.measures.popper;
  const element = state.elements[altArea ? altContext : elementContext];

  const clippingClientRect = getOverflowRect(element, area, rootArea);
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

  const overflowOffsets = getOverflowOffsets(
    elementClientRect,
    clippingClientRect
  );

  // Offsets can be applied only to the popper element
  if (elementContext === popper) {
    const offset = state.modifiersData.offset;

    Object.keys(overflowOffsets).forEach(key => {
      const multiply = [right, bottom].includes(key) ? 1 : -1;
      const axis = [top, bottom].includes(key) ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}
