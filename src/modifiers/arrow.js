// @flow
import type { Modifier, ModifierArguments } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getRectRelativeToOffsetParent from '../dom-utils/getRectRelativeToOffsetParent';
import getCommonTotalScroll from '../dom-utils/getCommonTotalScroll';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import within from '../utils/within';
import { left, right } from '../enums';

type Options = { element: HTMLElement | string };

export function arrow({ state, options = {} }: ModifierArguments<Options>) {
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
  const isVertical = [left, right].includes(basePlacement);
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
  const totalScrollValue =
    commonTotalScroll[axis === 'y' ? 'scrollTop' : 'scrollLeft'];

  const endDiff =
    state.measures.reference[len] +
    state.measures.reference[axis] -
    popperOffsets[axis] -
    state.measures.popper[len];
  const startDiff = popperOffsets[axis] - state.measures.reference[axis];

  // Only center to reference if the popper is longer than reference along the
  // axis
  const popperReferenceSizeDiff =
    state.measures.popper[len] - state.measures.reference[len];

  const centerToReference =
    popperReferenceSizeDiff > 0
      ? endDiff / 2 - startDiff / 2 - totalScrollValue
      : 0;

  // Check where the arrow is in relation to the reference edges so it doesn't
  // go outside of the reference bounds
  const arrowOffset = popperOffsets[axis] + totalScrollValue;

  const startReferenceOffset =
    arrowOffset +
    arrowElementRect[len] / 2 -
    (state.measures.reference[axis] +
      state.measures.reference[len] -
      state.measures.popper[len] / 2) -
    (popperReferenceSizeDiff > 0 ? popperReferenceSizeDiff : 0);
  const endReferenceOffset =
    arrowOffset -
    arrowElementRect[len] / 2 -
    (state.measures.reference[axis] - state.measures.popper[len] / 2) +
    (popperReferenceSizeDiff > 0 ? popperReferenceSizeDiff : 0);

  const startArrowOffset = startReferenceOffset > 0 ? startReferenceOffset : 0;
  const endArrowOffset = endReferenceOffset < 0 ? endReferenceOffset : 0;

  let center =
    state.measures.popper[len] / 2 -
    arrowElementRect[len] / 2 +
    centerToReference -
    endArrowOffset -
    startArrowOffset;

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
