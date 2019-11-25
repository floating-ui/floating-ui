// @flow
import {
  basePlacements,
  top,
  left,
  right,
  bottom,
  type Placement,
} from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import within from '../utils/within';

type Options = {
  /* Prevents boundaries overflow on the main axis */
  mainAxis: boolean,
  /* Prevents boundaries overflow on the alternate axis */
  altAxis: boolean,
  /* Allows the popper to overflow from its boundaries to keep it near its reference element */
  tether: boolean,
  /* Sets a padding to the provided boundary */
  padding: Padding,
};

export function preventOverflow(state: State, options?: Options = {}) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
    tether = true,
    padding = 0,
  } = options;
  const overflow = state.modifiersData.detectOverflow;
  const basePlacement = getBasePlacement(state.placement);
  const mainAxis = getMainAxisFromPlacement(basePlacement);
  const altAxis = getAltAxis(mainAxis);
  const popperOffsets = state.offsets.popper;
  const referenceRect = state.measures.reference;
  const popperRect = state.measures.popper;
  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  if (checkMainAxis) {
    const mainSide = mainAxis === 'y' ? top : left;
    const altSide = mainAxis === 'y' ? bottom : right;
    const len = mainAxis === 'y' ? 'height' : 'width';
    const offset = popperOffsets[mainAxis];
    const min =
      popperOffsets[mainAxis] + overflow[mainSide] + paddingObject[mainSide];
    const max =
      popperOffsets[mainAxis] - overflow[altSide] - paddingObject[altSide];
    const tetherMin =
      state.offsets.popper[mainAxis] -
      referenceRect[len] / 2 +
      popperRect[len] / 2;
    const tetherMax =
      state.offsets.popper[mainAxis] +
      referenceRect[len] / 2 -
      popperRect[len] / 2;
    const isReferenceLarger = referenceRect[len] > popperRect[len];

    state.offsets.popper[mainAxis] = within(
      tether
        ? isReferenceLarger
          ? Math.min(min, tetherMax)
          : Math.min(min, tetherMin)
        : min,
      offset,
      tether
        ? isReferenceLarger
          ? Math.max(max, tetherMin)
          : Math.max(max, tetherMax)
        : max
    );
  }
  if (checkAltAxis) {
    const mainSide = mainAxis === 'x' ? top : left;
    const altSide = mainAxis === 'x' ? bottom : right;

    state.offsets.popper[altAxis] = within(
      popperOffsets[altAxis] + overflow[mainSide] + paddingObject[mainSide],
      popperOffsets[altAxis],
      popperOffsets[altAxis] - overflow[altSide] - paddingObject[altSide]
    );
  }

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requires: ['detectOverflow'],
}: Modifier);
