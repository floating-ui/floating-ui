// @flow
import type { ModifierArguments, Modifier } from '../types';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getClippingParent from '../dom-utils/getClippingParent';
import getDocumentRect from '../dom-utils/getDocumentRect';
import getDocumentElement from '../dom-utils/getDocumentElement';
import getViewportRect from '../dom-utils/getViewportRect';
import computeOffsets from '../utils/computeOffsets';
import rectToClientRect from '../utils/rectToClientRect';

type Options = {
  clippingArea: HTMLElement | 'viewport',
  visibleArea: HTMLElement | 'viewport',
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

export function detectOverflow({
  state,
  options = {},
}: ModifierArguments<Options>) {
  const {
    clippingArea = getClippingParent(state.elements.popper),
    visibleArea = 'viewport',
  } = options;

  const popperElement = state.elements.popper;
  const referenceElement = state.elements.reference;
  const popperRect = state.measures.popper;
  const documentElement = getDocumentElement(state.elements.popper);

  if (
    typeof clippingArea !== 'string' &&
    !clippingArea.contains(popperElement)
  ) {
    if (__DEV__) {
      console.error(
        'Popper: "detectOverflow" can accept as `boundaryElement` only a parent node of the provided popper.'
      );
    }
    return state;
  }

  const clippingClientRect =
    documentElement === clippingArea
      ? rectToClientRect(getDocumentRect(documentElement))
      : clippingArea === 'viewport'
      ? rectToClientRect(getViewportRect(state.elements.popper))
      : getBoundingClientRect(clippingArea);
  const visibleClientRect =
    visibleArea === 'viewport'
      ? rectToClientRect(getViewportRect(state.elements.popper))
      : getBoundingClientRect(visibleArea);

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
