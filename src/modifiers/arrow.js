// @flow
import type { Modifier, ModifierArguments, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getLayoutRect from '../dom-utils/getLayoutRect';
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
  const isVertical = [left, right].includes(basePlacement);
  const len = isVertical ? 'height' : 'width';

  if (!arrowElement) {
    return state;
  }

  const paddingObject = state.modifiersData[`${name}#persistent`].padding;
  const arrowRect = getLayoutRect(arrowElement);

  const endDiff =
    state.measures.reference[len] +
    state.measures.reference[axis] -
    popperOffsets[axis] -
    state.measures.popper[len];
  const startDiff = popperOffsets[axis] - state.measures.reference[axis];

  const centerToReference = endDiff / 2 - startDiff / 2;

  let center =
    state.measures.popper[len] / 2 - arrowRect[len] / 2 + centerToReference;

  const minProp = axis === 'y' ? top : left;
  const maxProp = axis === 'y' ? bottom : right;

  // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds
  center = within(
    paddingObject[minProp],
    center,
    state.measures.popper[len] - arrowRect[len] - paddingObject[maxProp]
  );

  // Prevents breaking syntax highlighting...
  const axisProp: string = axis;
  state.modifiersData[name] = { [axisProp]: center };

  return state;
}

function onLoad({ state, options, name }: ModifierArguments<Options>) {
  let { element: arrowElement = '[data-popper-arrow]', padding = 0 } = options;

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
        [
          'Popper: "arrow" modifier\'s `element` must be a child of the popper',
          'element.',
        ].join(' ')
      );
    }

    return state;
  }

  state.elements.arrow = arrowElement;
  state.modifiersData[`${name}#persistent`] = {
    padding: mergePaddingObject(
      typeof padding !== 'number'
        ? padding
        : expandToHashMap(padding, basePlacements)
    ),
  };

  return state;
}

export default ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  onLoad,
  requires: ['popperOffsets'],
  optionallyRequires: ['preventOverflow'],
}: Modifier<Options>);
