// @flow
import type {
  ModifierArguments,
  Modifier,
  ClientRectObject,
  VirtualElement,
} from '../types';
import type { OverflowArea, Context } from '../enums';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingRect from '../dom-utils/getClippingRect';
import getViewportRect from '../dom-utils/getViewportRect';
import computeOffsets from '../utils/computeOffsets';
import rectToClientRect from '../utils/rectToClientRect';
import {
  clippingParents,
  viewport,
  reference,
  popper,
  bottom,
  top,
  right,
} from '../enums';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';

type Options = {
  clippingArea: OverflowArea,
  visibleArea: OverflowArea,
  context: Context,
  alt: boolean,
};

// if the number is positive, the popper is overflowing by that number of pixels
// when 0, or negative, the popper is within its boundaries
type ModifierData = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

const getOverflowOffsets = (
  popperClientRect,
  boundaryClientRect
): ModifierData => ({
  top: boundaryClientRect.top - popperClientRect.top,
  bottom: popperClientRect.bottom - boundaryClientRect.bottom,
  left: boundaryClientRect.left - popperClientRect.left,
  right: popperClientRect.right - boundaryClientRect.right,
});

const getOverflowRect = (
  elementOrVirtualElement: Element | VirtualElement,
  area: OverflowArea
): ClientRectObject => {
  const element = unwrapVirtualElement(elementOrVirtualElement);

  switch (area) {
    case 'clippingParents':
      return getClippingRect(element);
    case 'viewport':
      return rectToClientRect(getViewportRect(element));
    default:
      return getBoundingClientRect(area);
  }
};

export function detectOverflow({
  state,
  options,
  name,
}: ModifierArguments<Options>) {
  const {
    clippingArea = clippingParents,
    visibleArea = viewport,
    context = popper,
    alt = false,
  } = options;

  const altContext = context === popper ? reference : popper;

  const referenceElement = state.elements.reference;
  const popperRect = state.measures.popper;
  const element = state.elements[alt ? altContext : context];

  const clippingClientRect = getOverflowRect(element, clippingArea);
  const visibleClientRect = getOverflowRect(element, visibleArea);

  const referenceClientRect = getBoundingClientRect(referenceElement);

  const popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: state.placement,
    scroll: {
      scrollTop: 0,
      scrollLeft: 0,
    },
  });

  const popperClientRect = rectToClientRect({
    ...popperRect,
    ...popperOffsets,
  });

  const elementClientRect =
    context === popper ? popperClientRect : referenceClientRect;

  const clippingAreaOffsets = getOverflowOffsets(
    elementClientRect,
    clippingClientRect
  );
  const visibleAreaOffsets = getOverflowOffsets(
    elementClientRect,
    visibleClientRect
  );

  // Add `offset`
  if (context === popper) {
    const offset = state.modifiersData.offset;
    [clippingAreaOffsets, visibleAreaOffsets].forEach(offsets => {
      Object.keys(offsets).forEach(key => {
        const multiply = [right, bottom].includes(key) ? 1 : -1;
        const axis = [top, bottom].includes(key) ? 'y' : 'x';
        offsets[key] += offset[axis] * multiply;
      });
    });
  }

  state.modifiersData[name] = {
    clippingArea: clippingAreaOffsets,
    visibleArea: visibleAreaOffsets,
  };

  return state;
}

export default ({
  name: 'detectOverflow',
  enabled: true,
  phase: 'read',
  fn: detectOverflow,
  requires: ['popperOffsets'],
  optionallyRequires: ['offset'],
  data: {},
}: Modifier<Options>);
