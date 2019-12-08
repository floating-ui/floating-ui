// @flow
import type { ModifierArguments, Modifier, ClientRectObject } from '../types';
import type { OverflowArea } from '../enums';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingParent from '../dom-utils/getClippingParent';
import getDocumentRect from '../dom-utils/getDocumentRect';
import getDocumentElement from '../dom-utils/getDocumentElement';
import getViewportRect from '../dom-utils/getViewportRect';
import computeOffsets from '../utils/computeOffsets';
import rectToClientRect from '../utils/rectToClientRect';
import { clippingParent, viewport } from '../enums';

type Options = {
  clippingArea: OverflowArea,
  visibleArea: OverflowArea,
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
  popper: HTMLElement,
  area: OverflowArea
): ClientRectObject => {
  switch (area) {
    case 'clippingParent':
      const documentElement = getDocumentElement(popper);
      const clippingParent = getClippingParent(popper);
      return clippingParent === documentElement
        ? rectToClientRect(getDocumentRect(documentElement))
        : getBoundingClientRect(clippingParent);
    case 'viewport':
      return rectToClientRect(getViewportRect(popper));
    default:
      return getBoundingClientRect(area);
  }
};

export function detectOverflow({ state, options }: ModifierArguments<Options>) {
  const { clippingArea = clippingParent, visibleArea = viewport } = options;

  const popperElement = state.elements.popper;
  const referenceElement = state.elements.reference;
  const popperRect = state.measures.popper;

  const clippingClientRect = getOverflowRect(popperElement, clippingArea);
  const visibleClientRect = getOverflowRect(popperElement, visibleArea);

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

  state.modifiersData.detectOverflow = {
    clippingArea: getOverflowOffsets(popperClientRect, clippingClientRect),
    visibleArea: getOverflowOffsets(popperClientRect, visibleClientRect),
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
