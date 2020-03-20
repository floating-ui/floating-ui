// @flow
import type { Modifier, ModifierArguments, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getLayoutRect from '../dom-utils/getLayoutRect';
import contains from '../dom-utils/contains';
import getOffsetParent from '../dom-utils/getOffsetParent';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import within from '../utils/within';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { left, right, basePlacements, top, bottom } from '../enums';

type Options = {
  element: HTMLElement | string,
  padding: Padding,
};

function arrow({ state, name }: ModifierArguments<Options>) {
  const arrowElement = state.elements.arrow;
  const popperOffsets = state.modifiersData.popperOffsets;
  const basePlacement = getBasePlacement(state.placement);
  const axis = getMainAxisFromPlacement(basePlacement);
  const isVertical = [left, right].indexOf(basePlacement) >= 0;
  const len = isVertical ? 'height' : 'width';

  if (!arrowElement) {
    return;
  }

  const paddingObject = state.modifiersData[`${name}#persistent`].padding;
  const arrowRect = getLayoutRect(arrowElement);
  const minProp = axis === 'y' ? top : left;
  const maxProp = axis === 'y' ? bottom : right;

  const endDiff =
    state.rects.reference[len] +
    state.rects.reference[axis] -
    popperOffsets[axis] -
    state.rects.popper[len];
  const startDiff = popperOffsets[axis] - state.rects.reference[axis];

  const arrowOffsetParent =
    state.elements.arrow && getOffsetParent(state.elements.arrow);
  const clientSize = arrowOffsetParent
    ? axis === 'y'
      ? arrowOffsetParent.clientHeight || 0
      : arrowOffsetParent.clientWidth || 0
    : 0;

  const centerToReference = endDiff / 2 - startDiff / 2;

  // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds
  const min = paddingObject[minProp];
  const max = clientSize - arrowRect[len] - paddingObject[maxProp];
  const center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  const offset = within(min, center, max);

  // Prevents breaking syntax highlighting...
  const axisProp: string = axis;
  state.modifiersData[name] = {
    [axisProp]: offset,
    centerOffset: offset - center,
  };
}

function effect({ state, options, name }: ModifierArguments<Options>) {
  let { element: arrowElement = '[data-popper-arrow]', padding = 0 } = options;

  // CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (__DEV__) {
      console.error(
        [
          'Popper: "arrow" modifier\'s `element` must be a child of the popper',
          'element.',
        ].join(' ')
      );
    }

    return;
  }

  state.elements.arrow = arrowElement;
  state.modifiersData[`${name}#persistent`] = {
    padding: mergePaddingObject(
      typeof padding !== 'number'
        ? padding
        : expandToHashMap(padding, basePlacements)
    ),
  };
}

export default ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow'],
}: Modifier<Options>);
