// @flow
import type { State, Modifier } from '../types';
import getBoundingClientRect from '../dom-utils/getBoundingClientRect';
import getElementClientRect from '../dom-utils/getElementClientRect';
import getElementMargins from '../dom-utils/getElementMargins';
import computeOffsets from '../utils/computeOffsets';

type Options = {
  boundaryElement: HTMLElement,
};

type ModifierData = {
  top: boolean,
  bottom: boolean,
  right: boolean,
  left: boolean,
};

export function detectOverflow(
  state: State,
  options: Options = {
    boundaryElement: state.elements.popper.ownerDocument.body,
  }
) {
  const popperElement = state.elements.popper;
  const referenceElement = state.elements.reference;
  const popperRect = state.measures.popper;
  const referenceRect = state.measures.reference;
  if (!options.boundaryElement.contains(popperElement)) {
    console.error(
      'PopperJS: "detectOverflow" can accept as `boundaryElement` only a parent node of the provided popper.'
    );
    return state;
  }

  const boundaryClientRect = getBoundingClientRect(options.boundaryElement);
  const referenceClientRect = getBoundingClientRect(referenceElement);
  const boundaryMargins = getElementMargins(options.boundaryElement);
  const boundaryRect = {
    left: boundaryClientRect.left - boundaryMargins.left,
    right: boundaryClientRect.right - boundaryMargins.right,
    top: boundaryClientRect.top - boundaryMargins.top,
    bottom:
      boundaryClientRect.bottom - boundaryMargins.top - boundaryMargins.bottom,
  };

  const popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: state.options.placement,
    scroll: {
      scrollTop: 0,
      scrollLeft: 0,
    },
  });

  console.log(boundaryMargins);

  const popperClientRect = Object.assign({}, popperOffsets, {
    top: popperOffsets.y,
    bottom: popperOffsets.y + popperRect.height,
    left: popperOffsets.x,
    right: popperOffsets.x + popperRect.width,
  });

  state.modifiersData.detectOverflow = {
    top: boundaryRect.top > popperClientRect.top,
    bottom: boundaryRect.bottom < popperClientRect.bottom,
    left: boundaryRect.left > popperClientRect.left,
    right: boundaryRect.right < popperClientRect.right,
  };

  console.log(boundaryRect, popperClientRect);
  console.log(state.modifiersData.detectOverflow);

  return state;
}

export default ({
  name: 'detectOverflow',
  enabled: true,
  phase: 'read',
  fn: detectOverflow,
  data: {},
}: Modifier);
