// @flow
import type { State, Modifier } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getRectRelativeToOffsetParent from '../dom-utils/getRectRelativeToOffsetParent';
import getCommonTotalScroll from '../dom-utils/getCommonTotalScroll';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import within from '../utils/within';

type Options = { element: HTMLElement | string };

export function arrow(state: State, options?: Options = {}) {
  let { element: arrowElement = '[data-popper-arrow]' } = options;

  // CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return state;
    }
  }

  if (!state.elements.popper.contains(arrowElement)) {
    if (__DEV__) {
      console.error(
        'Popper: "arrow" modifier\'s `element` must be a child of the popper element.'
      );
    }

    return state;
  }

  state.elements.arrow = arrowElement;

  const popperOffsets = state.modifiersData.popperOffsets;
  const basePlacement = getBasePlacement(state.placement);
  const axis = getMainAxisFromPlacement(basePlacement);
  const isVertical = ['left', 'right'].includes(basePlacement);
  const len = isVertical ? 'height' : 'width';

  const arrowElementRect = addClientRectMargins(
    getRectRelativeToOffsetParent(arrowElement),
    arrowElement
  );

  const commonTotalScroll = getCommonTotalScroll(
    unwrapVirtualElement(state.elements.reference),
    state.scrollParents.reference,
    state.scrollParents.popper
  );

  const endDiff =
    state.measures.reference[len] +
    state.measures.reference[axis] -
    popperOffsets[axis] -
    state.measures.popper[len];

  const startDiff = popperOffsets[axis] - state.measures.reference[axis];

  // Only center to reference if the popper is longer than reference along the
  // axis
  const centerToReference =
    state.measures.popper[len] > state.measures.reference[len]
      ? endDiff / 2 -
        startDiff / 2 -
        commonTotalScroll[axis === 'y' ? 'scrollTop' : 'scrollLeft']
      : 0;

  let center =
    state.measures.popper[len] / 2 -
    arrowElementRect[len] / 2 +
    centerToReference;

  // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds
  center = within(
    0,
    center,
    state.measures.popper[len] - arrowElementRect[len]
  );

  // Prevents breaking syntax highlighting...
  const axisProp: string = axis;
  state.modifiersData.arrow = { [axisProp]: center };

  return state;
}

export default ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  requires: ['popperOffsets'],
}: Modifier<Options>);
