// @flow
import {
  basePlacements,
  top,
  left,
  right,
  bottom,
  clippingParents,
} from '../enums';
import type { Placement, OverflowArea, RootOverflowArea } from '../enums';
import type { Rect, ModifierArguments, Modifier, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import within from '../utils/within';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getLayoutRect from '../dom-utils/getLayoutRect';
import detectOverflow from '../utils/detectOverflow';

type TetherOffset =
  | (({
      popper: Rect,
      reference: Rect,
      placement: Placement,
    }) => number)
  | number;

type Options = {
  /* Prevents boundaries overflow on the main axis */
  mainAxis: boolean,
  /* Prevents boundaries overflow on the alternate axis */
  altAxis: boolean,
  /* The area to check the popper is overflowing in */
  area: OverflowArea,
  /* If the popper is not overflowing the main area, fallback to this one */
  rootArea: RootOverflowArea,
  /**
   * Allows the popper to overflow from its boundaries to keep it near its
   * reference element
   */
  tether: boolean,
  /* Offsets when the `tether` option should activate */
  tetherOffset: TetherOffset,
  /* Sets a padding to the provided boundary */
  padding: Padding,
};

function preventOverflow({ state, options, name }: ModifierArguments<Options>) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
    area = clippingParents,
    rootArea = 'document',
    tether = true,
    tetherOffset = 0,
    padding = 0,
  } = options;

  const overflow = detectOverflow(state, { area, rootArea });
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
  const tetherOffsetValue =
    typeof tetherOffset === 'function'
      ? tetherOffset({
          ...state.measures,
          placement: state.placement,
        })
      : tetherOffset;

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

    const additive = tether ? -popperRect[len] / 2 : 0;

    // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds
    const arrowElement = state.elements.arrow;
    const arrowRect =
      arrowElement && tether
        ? addClientRectMargins(getLayoutRect(arrowElement), arrowElement)
        : { width: 0, height: 0 };
    // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)
    const arrowLen = within(
      0,
      Math.abs(referenceRect[len] - arrowRect[len]),
      arrowRect[len]
    );

    const tetherMin =
      state.modifiersData.popperOffsets[mainAxis] +
      referenceRect[len] / 2 -
      additive -
      arrowLen -
      tetherOffsetValue;
    const tetherMax =
      state.modifiersData.popperOffsets[mainAxis] -
      referenceRect[len] / 2 +
      additive +
      arrowLen +
      tetherOffsetValue;

    const preventedOffset = within(
      tether ? Math.min(min, tetherMin) : min,
      offset,
      tether ? Math.max(max, tetherMax) : max
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
  requires: [],
  optionallyRequires: ['offset'],
}: Modifier<Options>);
