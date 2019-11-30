// @flow
import type { State, Modifier } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getElementClientRect from '../dom-utils/getElementClientRect';
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
        'Popper: "arrow" modifier\'s `element` must be child of the popper element.'
      );
    }

    return state;
  }

  state.elements.arrow = arrowElement;

  const popperOffsets = state.modifiersData.popperOffsets;
  const basePlacement = getBasePlacement(state.placement);
  const isVertical = ['left', 'right'].includes(basePlacement);
  const axis = getMainAxisFromPlacement(basePlacement);
  const len = isVertical ? 'height' : 'width';
  const side = isVertical ? 'top' : 'left';

  const arrowElementRect = addClientRectMargins(
    getElementClientRect(arrowElement),
    arrowElement
  );

  const endDiff =
    state.measures.reference[len] +
    state.measures.reference[axis] -
    (state.modifiersData.popperOffsets[axis] + state.measures.popper[len]);

  const startDiff =
    state.modifiersData.popperOffsets[axis] - state.measures.reference[axis];

  let center =
    state.measures.popper[len] / 2 -
    arrowElementRect[len] / 2 +
    endDiff / 2 -
    startDiff / 2;

  // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds
  center = within(
    0,
    center,
    state.measures.popper[len] - arrowElementRect[len]
  );

  // Flow: How to use computed property like {[axis]: center}?
  state.modifiersData.arrowOffsets = { x: 0, y: 0 };
  state.modifiersData.arrowOffsets[axis] = center;

  return state;
}

export default ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  requires: ['popperOffsets'],
}: Modifier<Options>);
