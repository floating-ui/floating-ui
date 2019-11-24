// @flow
import { top, left, right, bottom, type Placement } from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import mergePaddingObject from '../utils/mergePaddingObject';

export function preventOverflow(
  state: State,
  options: { mainAxis: boolean, altAxis: boolean, padding: Padding } = {}
) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
    padding = { left: 50, top: 20, right: 0, bottom: 0 },
  } = options;
  const overflow = state.modifiersData.detectOverflow;
  const basePlacement = getBasePlacement(state.placement);
  const mainAxis = getMainAxisFromPlacement(basePlacement);
  const altAxis = getAltAxis(mainAxis);
  const popperOffsets = state.offsets.popper;
  const isNumberPadding = typeof padding === 'number';
  const mergedPadding = isNumberPadding ? {} : mergePaddingObject(padding);

  if (checkMainAxis) {
    const mainSide = mainAxis === 'y' ? top : left;
    const altSide = mainAxis === 'y' ? bottom : right;
    const mainPadding = isNumberPadding ? padding : mergedPadding[mainSide];
    const altPadding = isNumberPadding ? padding : mergedPadding[altSide];

    state.offsets.popper[mainAxis] = Math.max(
      Math.min(
        popperOffsets[mainAxis],
        popperOffsets[mainAxis] - overflow[altSide] - altPadding
      ),
      popperOffsets[mainAxis] + overflow[mainSide] + mainPadding
    );
  }
  if (checkAltAxis) {
    const mainSide = mainAxis === 'x' ? top : left;
    const altSide = mainAxis === 'x' ? bottom : right;
    const mainPadding = isNumberPadding ? padding : mergedPadding[mainSide];
    const altPadding = isNumberPadding ? padding : mergedPadding[altSide];

    console.log(altAxis, mainSide, overflow[altSide]);

    state.offsets.popper[altAxis] = Math.max(
      Math.min(
        popperOffsets[altAxis],
        popperOffsets[altAxis] - overflow[altSide] - altPadding
      ),
      popperOffsets[altAxis] + overflow[mainSide] + mainPadding
    );
  }

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
}: Modifier);
