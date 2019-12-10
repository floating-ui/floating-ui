// @flow
import type {
  ModifierArguments,
  Modifier,
  ClientRectObject,
  VirtualElement,
} from '../types';
import type { OverflowArea } from '../enums';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingRect from '../dom-utils/getClippingRect';
import getViewportRect from '../dom-utils/getViewportRect';
import computeOffsets from '../utils/computeOffsets';
import rectToClientRect from '../utils/rectToClientRect';
import { clippingParents, viewport } from '../enums';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';

type Options = {
  clippingArea: OverflowArea,
  visibleArea: OverflowArea,
  context: 'popper' | 'reference',
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
    context = 'popper',
  } = options;

  const popperElement = state.elements.popper;
  const referenceElement = state.elements.reference;
  const element = state.elements[context];
  const popperRect = state.measures.popper;

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
    element === popperElement ? popperClientRect : referenceClientRect;

  state.modifiersData[name] = {
    clippingArea: getOverflowOffsets(elementClientRect, clippingClientRect),
    visibleArea: getOverflowOffsets(elementClientRect, visibleClientRect),
  };

  return state;
}

export default ({
  name: 'detectOverflow',
  enabled: true,
  phase: 'read',
  fn: detectOverflow,
  requires: ['popperOffsets'],
  data: {},
}: Modifier<Options>);
