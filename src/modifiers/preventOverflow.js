// @flow
import {
  basePlacements,
  top,
  left,
  right,
  bottom,
  surfaces,
  edges,
  center,
} from '../enums';
import type { Tether } from '../enums';
import type { ModifierArguments, Modifier, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import within from '../utils/within';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getLayoutRect from '../dom-utils/getLayoutRect';

type Options = {
  /* Prevents boundaries overflow on the main axis */
  mainAxis: boolean,
  /* Prevents boundaries overflow on the alternate axis */
  altAxis: boolean,
  /**
   * Allows the popper to overflow from its boundaries to keep it near its reference element:
   * - false: popper can never overflow, will detach from reference to stay visible;
   * - "center": popper can overflow once the center of the popper is at the edge of the reference;
   * - "edges": popper can overflow once the opposite edges are level;
   * - "surfaces":  popper can overflow once the surfaces are level;
   */
  tether: Tether,
  /* Sets a padding to the provided boundary */
  padding: Padding,
};

function preventOverflow({ state, options, name }: ModifierArguments<Options>) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
    tether = center,
    padding = 0,
  } = options;
  const overflow =
    state.modifiersData['detectOverflow:preventOverflow'].overflowOffsets;
  const basePlacement = getBasePlacement(state.placement);
  const mainAxis = getMainAxisFromPlacement(basePlacement);
  const altAxis = getAltAxis(mainAxis);
  const popperOffsets = state.modifiersData.popperOffsets;
  const referenceRect = state.measures.reference;
  const popperRect = state.measures.popper;
  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const data = { x: 0, y: 0 };

  if (checkMainAxis) {
    const mainSide = mainAxis === 'y' ? top : left;
    const altSide = mainAxis === 'y' ? bottom : right;
    const len = mainAxis === 'y' ? 'height' : 'width';
    const offset = popperOffsets[mainAxis];

    const min =
      popperOffsets[mainAxis] + overflow[mainSide] + paddingObject[mainSide];
    const max =
      popperOffsets[mainAxis] - overflow[altSide] - paddingObject[altSide];

    const additive =
      tether === surfaces
        ? popperRect[len] / 2
        : tether === edges
        ? -popperRect[len] / 2
        : 0;

    // For the "edges" value, we need to include the arrow in the calculation
    // so the arrow doesn't go outside the reference bounds
    const arrowElement = state.elements.arrow;
    const arrowElementRect =
      arrowElement && tether === edges
        ? addClientRectMargins(getLayoutRect(arrowElement), arrowElement)
        : { width: 0, height: 0 };

    const tetherMin =
      state.modifiersData.popperOffsets[mainAxis] -
      referenceRect[len] / 2 +
      additive +
      arrowElementRect[len];
    const tetherMax =
      state.modifiersData.popperOffsets[mainAxis] +
      referenceRect[len] / 2 -
      additive -
      arrowElementRect[len];

    const lenCondition =
      referenceRect[len] > popperRect[len] || tether !== surfaces;

    const preventedOffset = within(
      tether ? Math.min(min, lenCondition ? tetherMax : tetherMin) : min,
      offset,
      tether ? Math.max(max, lenCondition ? tetherMin : tetherMax) : max
    );

    state.modifiersData.popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    const mainSide = mainAxis === 'x' ? top : left;
    const altSide = mainAxis === 'x' ? bottom : right;
    const offset = popperOffsets[altAxis];

    const preventedOffset = within(
      offset + overflow[mainSide] + paddingObject[mainSide],
      offset,
      offset - overflow[altSide] - paddingObject[altSide]
    );

    state.modifiersData.popperOffsets[altAxis] = preventedOffset;
    data[altAxis] = preventedOffset - offset;
  }

  state.modifiersData[name] = data;

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requires: ['detectOverflow:preventOverflow'],
  optionallyRequires: ['offset'],
}: Modifier<Options>);
